import { IsNumberString, IsNotEmpty, IsEmail, IsStrongPassword, IsString, Length } from "class-validator";

export class CreateUserDto {
    // @IsNumberString()
    // @IsNotEmpty()
    // id: number;

    @IsNotEmpty()
    @Length(3, 16)
    name: string;

    @IsEmail()
    @Length(8, 16)
    email: string;

    @IsString()
    @Length(8, 16)
    password: string;
}
