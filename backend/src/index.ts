import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT ?? 4000);
const jwtSecret = process.env.JWT_SECRET ?? "dev-only-tileskart-secret";

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

type AuthUser = { id: string; email: string; name: string; role: string };
type AuthedRequest = express.Request & { user?: AuthUser };

const signToken = (user: AuthUser) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, jwtSecret, { expiresIn: "7d" });

const auth = async (req: AuthedRequest, res: express.Response, next: express.NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    req.user = jwt.verify(token, jwtSecret) as AuthedRequest["user"];
    return next();
  } catch {
    return res.status(401).json({ message: "Session expired" });
  }
};

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(6),
  label: z.string().default("Home")
});

const orderSchema = z.object({
  address: addressSchema,
  items: z.array(z.object({ productId: z.string(), quantitySqFt: z.number().int().min(1) })).min(1)
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "TilesKart", database: "Neon Postgres via Prisma" });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: { name: body.name, email: body.email.toLowerCase(), phone: body.phone, passwordHash },
      select: { id: true, name: true, email: true, role: true }
    });
    res.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    return res.json({ user: safeUser, token: signToken(safeUser) });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    const search = String(req.query.search ?? "");
    const category = String(req.query.category ?? "");
    const products = await prisma.product.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { material: { contains: search, mode: "insensitive" } },
                  { origin: { contains: search, mode: "insensitive" } }
                ]
              }
            : {},
          category && category !== "All" ? { category } : {}
        ]
      },
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }]
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:slug", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/me/orders", auth, async (req: AuthedRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { address: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", auth, async (req: AuthedRequest, res, next) => {
  try {
    const body = orderSchema.parse(req.body);
    const products = (await prisma.product.findMany({
      where: { id: { in: body.items.map((item) => item.productId) } }
    })) as Array<{ id: string; pricePerSqFt: number }>;
    const productMap = new Map(products.map((product) => [product.id, product]));

    const pricedItems = body.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error("A product in your cart is no longer available");
      }
      return {
        productId: item.productId,
        quantitySqFt: item.quantitySqFt,
        pricePerSqFt: product.pricePerSqFt,
        lineTotal: product.pricePerSqFt * item.quantitySqFt
      };
    });

    const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryFee = subtotal > 50000 ? 0 : 1499;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + deliveryFee + gst;

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: req.user!.id } },
        subtotal,
        deliveryFee,
        gst,
        total,
        address: { create: { ...body.address, user: { connect: { id: req.user!.id } } } },
        items: { create: pricedItems }
      },
      include: { address: true, items: { include: { product: true } } }
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

app.post("/api/ai/design-advice", async (req, res, next) => {
  try {
    const prompt = z.object({ room: z.string().min(2), budget: z.string(), vibe: z.string() }).parse(req.body);
    if (!process.env.OPENROUTER_API_KEY) {
      return res.json({
        advice:
          "For Indian homes, pair large glossy marble-look slabs in the main hall with matte anti-skid tiles for balconies and bathrooms. Keep 8-12% extra material for cutting and future repairs."
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are TilesKart's interior tile advisor for Indian homes. Be concise and practical." },
        { role: "user", content: `Room: ${prompt.room}. Budget: ${prompt.budget}. Vibe: ${prompt.vibe}. Suggest tile categories, finish, and buying tips.` }
      ]
    });

    return res.json({ advice: completion.choices[0]?.message.content });
  } catch (error) {
    return next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: "Invalid input", details: error.issues });
  }
  if (error instanceof Error && error.message.includes("Unique constraint")) {
    return res.status(409).json({ message: "This email is already registered" });
  }
  console.error(error);
  return res.status(500).json({ message: error instanceof Error ? error.message : "Something went wrong" });
});

app.listen(port, () => {
  console.log(`TilesKart API running on http://localhost:${port}`);
});
