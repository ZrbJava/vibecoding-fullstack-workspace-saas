import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

