import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LogInDto {
  @IsNotEmpty({message: "email can not be empty"})    
    @IsEmail({}, {message: "Please preovide a valid email"})
    email: string;    
    
    @IsString()
    @IsNotEmpty({message: "Password can not empty"})
    @MinLength(5, {message: "Password mininum character should be 5"})
    password: string; 
}

export default LogInDto;