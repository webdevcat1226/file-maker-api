import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class FindQuotesDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class LogoutDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}
