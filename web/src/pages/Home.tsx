import { useEffect, useState } from "react";

type Health = { api: string; db: string };

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
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/healthz")
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setError(String(err)));
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
        <StatusRow label="API host" ok={health?.api === "ok"} detail={error ?? undefined} />
        <StatusRow
          label="Database"
          ok={health?.db === "ok"}
          detail={health && health.db !== "ok" ? health.db : undefined}
        />
      </div>
      <p className="mt-6 text-sm text-slate-500">See README.md and docs/engineering/IMPLEMENTATION_PLAN.md to begin.</p>
    </main>
  );
}
