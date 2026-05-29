import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CreditCard, ShieldCheck, Sparkle, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { MiniScene, HeroScene } from "../components/Scenes";

const testimonials = [
  {
    name: "Riya Mehta",
    place: "Ahmedabad villa renovation",
    quote: "TilesKart made premium Morbi slabs feel easy to compare. The finish details and square-foot pricing were exactly what my contractor needed."
  },
  {
    name: "Arjun Nair",
    place: "Kochi cafe buildout",
    quote: "The terrazzo selection looked bold without becoming messy. We planned the whole cafe floor from the marketplace flow."
  },
  {
    name: "Farhan Shaikh",
    place: "Pune apartment upgrade",
    quote: "Checkout felt practical: address, GST, freight, everything visible before placing the demo order."
  }
];

export function LandingPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="absolute inset-0">
          <HeroScene />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,9,.92),rgba(10,10,9,.58),rgba(10,10,9,.25))]" />
        <div className="relative z-10 mx-auto grid min-h-[92svh] max-w-7xl content-center gap-8 px-4 pt-24 lg:grid-cols-[1fr_.7fr]">
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur">
              <Sparkle size={16} className="text-amber-300" />
              Premium tiles, marbles, and stones for Indian homes
            </div>
            <h1 className="text-balance text-5xl font-black leading-[.95] tracking-normal sm:text-7xl lg:text-8xl">
              Build floors that look like money.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
              Shop vitrified slabs, Makrana marble, Kota stone, designer terrazzo, handmade Athangudi tiles, parking tiles, and bathroom-safe finishes through a proper ecommerce journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/marketplace" className="primary-button">
                Explore marketplace <ArrowRight size={19} />
              </Link>
              <Link to="/signup" className="secondary-button">
                Create account
              </Link>
            </div>
          </motion.div>
          <div className="hero-stat-panel">
            <div className="h-44">
              <MiniScene />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["18%", "GST shown"],
                ["Rs 0", "dummy payment"],
                ["PAN India", "delivery"]
              ].map(([value, label]) => (
                <div className="rounded border border-white/10 bg-white/10 p-3" key={value}>
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="text-xs text-white/65">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-4">
        {[
          [ShieldCheck, "Verified Indian supply", "Morbi, Rajasthan, Tamil Nadu, and pan-India stone networks."],
          [Truck, "Logistics ready", "Freight estimates, GST, and delivery fee included in checkout."],
          [BadgeCheck, "Real buying details", "Size, finish, stock, origin, and per-square-foot pricing."],
          [CreditCard, "Demo payment", "Professional checkout without live payment gateway dependency."]
        ].map(([Icon, title, text]) => (
          <div className="feature-tile" key={String(title)}>
            <Icon size={24} className="text-emerald-600" />
            <h3>{title as string}</h3>
            <p>{text as string}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="market-head">
          <div>
            <p className="section-kicker">Social proof</p>
            <h2 className="section-title">Designers, homeowners, and contractors can all use it</h2>
          </div>
          <Link className="primary-button" to="/login">
            Start shopping <ArrowRight size={18} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={17} className="fill-amber-400" />
                ))}
              </div>
              <p className="mt-5 text-lg font-bold leading-7">"{item.quote}"</p>
              <div className="mt-6">
                <p className="font-black">{item.name}</p>
                <p className="text-sm text-stone-500">{item.place}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
