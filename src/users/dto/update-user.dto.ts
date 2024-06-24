import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";


export class UpdateUserDto {
    @ApiProperty({example: 'user@mail.ru', description: 'User mail'})
    @IsString({message: "Must be string"})
    @IsEmail({},{message: 'Incorrect mail'})
    @IsOptional()
    email?: string;
    
    @ApiProperty({example: 'arni', description: 'Username'})
    @IsString({message: "Must be string"})
    @IsOptional()
    username?: string;
    
    @ApiProperty({example: '12345', description: 'User password'})
    @IsString({message: "Must be string"})
    @Length( 3, 16, {message: "Not less than 3 but not more than 16"})
    @IsOptional()   
    password?:string;
}