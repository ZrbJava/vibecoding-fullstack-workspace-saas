import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtUser } from '../auth/jwt.types';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  async create(@Body() dto: CreateWorkspaceDto, @CurrentUser() user: JwtUser) {
    const result = await this.workspacesService.createWorkspace({
      ownerId: user.userId,
      name: dto.name,
      description: dto.description,
    });

    return {
      workspace: result.workspace,
    };
  }

  @Get()
  async list(@CurrentUser() user: JwtUser) {
    const workspaces = await this.workspacesService.listWorkspacesForUser(
      user.userId,
    );

    return { workspaces };
  }
}

