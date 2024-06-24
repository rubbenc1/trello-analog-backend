import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateList{

    @ApiProperty({example: 'To do', description: 'List name'})
    @IsString({message: "Must be string"})
    readonly name: string;
}