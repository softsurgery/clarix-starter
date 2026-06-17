import { IsDateString, IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class CreateAbstractUserDto {
  @IsString()
  @Length(3, 50)
  @IsOptional()
  firstName?: string;

  @IsString()
  @Length(3, 50)
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  @Length(3, 50)
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}
