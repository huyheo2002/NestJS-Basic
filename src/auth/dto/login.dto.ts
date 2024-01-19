import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LogIn {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}

export default LogIn;