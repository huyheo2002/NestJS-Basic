import {
    IsEmail,
    IsString,
    IsNotEmpty,
    MinLength,
    Matches,    
} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({message: "email can not be empty"})    
    @IsEmail({}, {message: "Please preovide a valid email"})
    email: string;

    @IsString({message: "Name should be string"})
    @IsNotEmpty({message: "Name can not be null"})
    name: string;
    
    @IsString()
    @IsNotEmpty({message: "Password can not empty"})
    @MinLength(5, {message: "Password mininum character should be 5"})
    password: string;    
}

export default RegisterDto;
