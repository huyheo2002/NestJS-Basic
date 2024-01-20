import {
    IsEmail,
    IsString,
    IsNotEmpty,
    MinLength,
    Matches,    
} from 'class-validator';
import LogInDto from './login.dto';

export class RegisterDto extends LogInDto {
    @IsString({message: "Name should be string"})
    @IsNotEmpty({message: "Name can not be null"})
    name: string;

    // email - password: kế thừa từ logindto :v
    // @IsNotEmpty({message: "email can not be empty"})    
    // @IsEmail({}, {message: "Please preovide a valid email"})
    // email: string;
    
    // @IsString()
    // @IsNotEmpty({message: "Password can not empty"})
    // @MinLength(5, {message: "Password mininum character should be 5"})
    // password: string;    
}

export default RegisterDto;
