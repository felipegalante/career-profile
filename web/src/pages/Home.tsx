import { useEffect, useState } from "react";

type Health = { status: "ok" | "unavailable" };

async function checkHealth(endpoint: string, update: (health: Health) => void): Promise<void> {
  try {
    const response = await fetch(endpoint);
    const payload = (await response.json()) as Partial<Health>;
    update(response.ok && payload.status === "ok" ? { status: "ok" } : { status: "unavailable" });
  } catch {
    update({ status: "unavailable" });
  }
}

function StatusRow({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={ok ? "text-emerald-700" : "text-red-700"}>{ok ? "✓" : "✗"}</span>
      <span className="font-medium">{label}</span>
      {detail ? <span className="text-sm text-slate-500">{detail}</span> : null}
    </div>
  );
}

export function Home() {
  const [apiHealth, setApiHealth] = useState<Health | null>(null);
  const [databaseHealth, setDatabaseHealth] = useState<Health | null>(null);

  useEffect(() => {
    void checkHealth("/livez", setApiHealth);
    void checkHealth("/readyz", setDatabaseHealth);
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-10 font-sans text-slate-900">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-700">Project scaffold</p>
      <h1 className="mb-2 text-3xl font-semibold">Career Profile</h1>
      <p className="mb-6 text-slate-600">
        Product features are intentionally not implemented yet. This page verifies the web, API host, and database development environment.
        Phase 0 introduces the GraphQL product API.
      </p>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <StatusRow label="Web" ok detail="running" />
        <StatusRow label="API host" ok={apiHealth?.status === "ok"} />
        <StatusRow label="Database" ok={databaseHealth?.status === "ok"} />
      </div>
      <p className="mt-6 text-sm text-slate-500">See README.md and docs/engineering/IMPLEMENTATION_PLAN.md to begin.</p>
    </main>
  );
}
