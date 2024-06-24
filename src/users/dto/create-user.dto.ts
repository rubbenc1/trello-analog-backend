import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";


export class CreateUserDto {
    @ApiProperty({example: 'user@mail.ru', description: 'User mail'})
    @IsString({message: "Must be string"})
    @IsEmail({},{message: 'Incorrect mail'})
    readonly email: string;

    @ApiProperty({example: 'arni', description: 'Username'})
    @IsString({message: "Must be string"})
    readonly username: string;

    @ApiProperty({example: '12345', description: 'User password'})
    @IsString({message: "Must be string"})
    @Length( 3, 16, {message: "Not less than 3 but not more than 16"})
    readonly password:string;
}