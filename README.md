## Vibecoding 全栈训练项目

一个从前端到全栈的学习型项目，包含：

- **后端**：Node.js + TypeScript + NestJS + Prisma + PostgreSQL + Redis（规划）
- **前端**：React + Vite + TypeScript + Tailwind CSS
- **文档**：`docs/` 目录下按阶段拆分的架构、数据模型、接口规范、部署与运维手册等

### 目录结构

- `backend/`：NestJS 后端服务（Auth、Users、Workspaces 等模块）
- `frontend/`：React + Vite 前端应用（Tailwind UI）
- `docs/`：项目概览、架构设计、数据模型、接口规范、部署与运维、安全清单、复盘记录

### 本地开发

#### 前置依赖

- Node.js >= 18
- npm
- PostgreSQL（本地或远程实例）

#### 后端

```bash
cd backend
cp .env.example .env # 如存在示例文件，可按需修改
# 或手动创建 .env，至少包含：
# DATABASE_URL="postgresql://<user>@localhost:5432/vibecoding"
# JWT_SECRET="dev-secret-change-in-prod"

npm install
npx prisma migrate dev --name init_user
npx prisma generate
npm run start:dev
```

后端默认运行在 `http://localhost:3000`，健康检查地址为 `http://localhost:3000/api/health`。

#### 前端

```bash
cd frontend
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`，通过 Vite 代理访问后端 `/api/*`。

### 目标与阶段

项目的详细目标与阶段规划见：

- `docs/00-项目概览.md`
- `docs/01-架构设计.md`
- `docs/02-数据模型.md`
- `docs/03-接口规范.md`

后续会逐步实现：

- 完整的用户认证与权限系统（JWT + RBAC）
- Workspace / 任务管理 / 知识库 / 文件上传 / 审计日志 / 统计
- 云服务器部署（Docker + Nginx + HTTPS）与基础 CI/CD

