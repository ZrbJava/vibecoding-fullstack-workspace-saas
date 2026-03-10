import React, { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  timestamp: string;
};

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) {
          throw new Error(`请求失败: ${res.status}`);
        }
        const data = (await res.json()) as HealthResponse;
        setHealth(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(circle_at_top,#1e293b,#020617_50%,#000000)] text-slate-100">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900/80 px-10 py-9 shadow-2xl shadow-slate-950/80 ring-1 ring-slate-500/40 backdrop-blur-2xl">
        <h1 className="mb-3 text-2xl font-bold">Vibecoding 全栈训练环境</h1>
        <p className="mb-6 text-sm text-slate-400">
          这是你的前端入口页，我们先用它来检查与后端健康检查接口的连通性。
        </p>

        <div className="mb-5 rounded-xl border border-slate-500/60 bg-slate-950 px-5 py-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-100">
            后端健康检查
          </h2>
          {loading && (
            <p className="text-sm text-slate-400">正在请求 /api/health ...</p>
          )}
          {error && <p className="text-sm text-rose-400">请求失败：{error}</p>}
          {!loading && !error && health && (
            <div className="space-y-1">
              <p className="text-sm">
                状态：{' '}
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                  {health.status}
                </span>
              </p>
              <p className="text-xs text-slate-400">
                后端时间：{new Date(health.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          下一步，我们会在这个基础上搭建登录/注册页面，并逐步扩展到
          Workspace、任务看板和知识库。
        </p>
      </div>
    </div>
  );
};

