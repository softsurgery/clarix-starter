import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @Length(3, 50)
  label: string;

  @IsOptional()
  @IsString()
  description?: string;
}
