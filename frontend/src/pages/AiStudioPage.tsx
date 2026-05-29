import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { askDesigner } from "../api";

export function AiStudioPage() {
  const [form, setForm] = useState({ room: "Living room", budget: "Rs 1.5 lakh", vibe: "premium Indian marble look" });
  const [advice, setAdvice] = useState("Ask for a room and TilesKart AI will suggest the right material, finish, and buying buffer.");

  const handleAi = async () => {
    try {
      setAdvice(await askDesigner(form.room, form.budget, form.vibe));
    } catch {
      setAdvice("Use glossy large-format GVT for halls, matte anti-skid for wet areas, and keep 10% extra stock for cutting, skirting, and future repairs.");
    }
  };

  return (
    <main className="page-shell">
      <section className="ai-section rounded-none">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="section-kicker text-amber-300">OpenRouter ready</p>
            <h1 className="text-5xl font-black leading-none text-white">AI tile designer for Indian interiors</h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
              Add your OpenRouter API key in the backend `.env` and this studio becomes a live product advisor. Without it, the app still returns practical fallback advice.
            </p>
          </div>
          <div className="studio-panel">
            <div className="grid gap-3 sm:grid-cols-3">
              {(["room", "budget", "vibe"] as const).map((field) => (
                <label className="input-label" key={field}>
                  {field}
                  <input value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
                </label>
              ))}
            </div>
            <button className="primary-button mt-4" onClick={handleAi}>
              <WandSparkles size={18} /> Generate advice
            </button>
            <p className="mt-5 rounded border border-white/10 bg-white/10 p-4 text-white/80">{advice}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
