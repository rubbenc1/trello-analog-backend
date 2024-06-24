import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateProject{

    @ApiProperty({example: 'Product', description: 'Project name'})
    @IsString({message: "Must be string"})
    readonly name: string;
}