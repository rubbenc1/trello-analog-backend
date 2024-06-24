import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";


export class TasksColumnDto{

    @ApiProperty({example: 'Due date', description: 'Tasks column name'})
    @IsString({message:'Must be string'})
    @Length(3, 100, {message: 'Must be longer that 3 characters and shorter than 100'})
    readonly name: string;

}