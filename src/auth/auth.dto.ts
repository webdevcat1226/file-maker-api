import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LogoutDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}
