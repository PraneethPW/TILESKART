import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../api";
import { useStore } from "../store";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [notice, setNotice] = useState("");
  const isSignup = mode === "signup";

  const handleSubmit = async () => {
    try {
      const response = isSignup
        ? await register(form.name, form.email, form.password, form.phone)
        : await login(form.email, form.password);
      setUser(response.user, response.token);
    } catch {
      setUser({ id: "demo-user", name: form.name || "TilesKart Buyer", email: form.email || "demo@tileskart.in", role: "CUSTOMER" }, "demo-token");
      setNotice("Backend is not connected yet, so a demo session was created.");
    }
    navigate("/marketplace");
  };

  return (
    <main className="page-shell">
      <section className="auth-grid">
        <div className="auth-art">
          <p className="section-kicker text-amber-300">TilesKart account</p>
          <h1 className="mt-4 text-5xl font-black leading-none text-white">{isSignup ? "Create your tile buying workspace." : "Welcome back to TilesKart."}</h1>
          <p className="mt-5 max-w-md text-white/70">
            Login unlocks the marketplace, cart, checkout, dashboard, and AI design studio as separate app pages.
          </p>
        </div>
        <div className="modal-card">
          <h2 className="text-3xl font-black">{isSignup ? "Signup" : "Login"}</h2>
          <div className="mt-6 grid gap-3">
            {isSignup && <input className="field" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}
            <input className="field" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            {isSignup && <input className="field" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />}
            <input className="field" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            <button className="primary-button justify-center" onClick={handleSubmit}>
              {isSignup ? "Create account" : "Login"} <ArrowRight size={18} />
            </button>
            {notice && <p className="rounded bg-amber-50 p-3 text-sm font-semibold text-amber-800">{notice}</p>}
          </div>
          <p className="mt-5 text-sm text-stone-600">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link className="font-black text-emerald-700" to={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Login" : "Signup"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
