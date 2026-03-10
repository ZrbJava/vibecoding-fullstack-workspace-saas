import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from '@prisma/client';

@Injectable()
export class WorkspacesService {
  private prisma = new PrismaClient();

  async createWorkspace(params: {
    ownerId: string;
    name: string;
    description?: string;
  }): Promise<{ workspace: Workspace; member: WorkspaceMember }> {
    const { ownerId, name, description } = params;

    const result = await this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name,
          description,
          ownerId,
        },
      });

      const member = await tx.workspaceMember.create({
        data: {
          userId: ownerId,
          workspaceId: workspace.id,
          role: WorkspaceRole.OWNER,
        },
      });

      return { workspace, member };
    });

    return result;
  }

  async listWorkspacesForUser(userId: string): Promise<Workspace[]> {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => m.workspace);
  }
}

