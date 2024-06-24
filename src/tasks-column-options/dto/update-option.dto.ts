import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class UpdateOptionDto{

    @ApiProperty({example: 'High', description: 'Option name'})
    @IsString({message: "Must be string"})
    optionName: string;
}