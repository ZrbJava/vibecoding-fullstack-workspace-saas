import React, { FormEvent, useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  timestamp: string;
};

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('secret123');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error(`请求失败: ${res.status}`);
        const data = (await res.json()) as HealthResponse;
        setHealth(data);
      } catch (err) {
        setHealthError((err as Error).message);
      } finally {
        setHealthLoading(false);
      }
    }
    fetchHealth();
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `登录失败: ${res.status}`);
      }
      const data = (await res.json()) as AuthResponse;
      setUser(data.user);
    } catch (err) {
      setAuthError((err as Error).message);
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,#1e293b,#020617_55%,#000000)] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          {/* 左侧：品牌 + 健康检查 */}
          <div className="rounded-3xl bg-slate-900/80 px-8 py-8 shadow-2xl shadow-slate-950/80 ring-1 ring-slate-500/40 backdrop-blur-2xl">
            <div className="mb-6">
              <div className="mb-2 inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-600/60">
                Vibecoding · Fullstack Lab
              </div>
              <h1 className="mb-2 text-2xl font-semibold leading-tight">
                Vibecoding 全栈训练环境
              </h1>
              <p className="text-sm text-slate-400">
                这里是你的实验控制台。登录之后，我们会在同一个界面中逐步接入
                Workspace、任务和知识库功能。
              </p>
            </div>

            <div className="rounded-2xl border border-slate-600/60 bg-slate-950/80 px-5 py-4">
              <h2 className="mb-2 text-sm font-semibold text-slate-100">
                后端健康检查
              </h2>
              {healthLoading && (
                <p className="text-sm text-slate-400">
                  正在请求 <code className="text-xs text-slate-300">/api/health</code>{' '}
                  ...
                </p>
              )}
              {healthError && (
                <p className="text-sm text-rose-400">请求失败：{healthError}</p>
              )}
              {!healthLoading && !healthError && health && (
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

            <p className="mt-4 text-xs text-slate-500">
              当前阶段我们主要关注「鉴权 + Workspace
              建立」，后续会在这个界面上扩展任务看板与知识库导航。
            </p>
          </div>

          {/* 右侧：登录卡片（daisyUI） */}
          <div className="flex items-center">
            <div className="card w-full bg-base-200/90 shadow-2xl">
              <div className="card-body">
                <h2 className="card-title mb-1 text-lg">登录到控制台</h2>
                <p className="mb-4 text-xs text-base-content/60">
                  当前默认账号：
                  <span className="ml-1 font-mono text-[11px]">
                    test@example.com / secret123
                  </span>
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs">邮箱</span>
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      className="input input-bordered input-sm w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs">密码</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input input-bordered input-sm w-full"
                    />
                  </div>

                  {authError && (
                    <div className="alert alert-error py-2 text-xs">
                      <span>登录失败：{authError}</span>
                    </div>
                  )}

                  <div className="form-control pt-1">
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="btn btn-primary btn-sm w-full"
                    >
                      {authLoading ? '正在登录...' : '登录并进入 Workspace 训练'}
                    </button>
                  </div>
                </form>

                {user && (
                  <div className="mt-4 alert alert-success py-2 text-xs">
                    <span>
                      已登录：
                      <span className="font-semibold">
                        {user.name || user.email}
                      </span>
                      ，后续会在这里接入 Workspace 列表。
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


