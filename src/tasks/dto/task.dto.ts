import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Length, ValidateNested } from "class-validator";


class TaskColumnValueDto {
    @ApiProperty({example: 1, description: 'Column Id'})
    @IsNumber()
    columnId: number;

    @ApiProperty({example: 'John Doe', description: 'Value for the column'})
    @IsOptional()
    @IsString({each: true})
    @IsNumber({},{each: true})
    value?: string | number;

    @ApiProperty({ example: 3, description: 'The ID of the selected option', required: false })
    @IsOptional()
    @IsNumber()
    optionId?: number;
}


export class TaskDto{

    @ApiProperty({example: 'Step 1', description: 'Task name'})
    @IsString({message:'Must be string'})
    @Length(3, 100, {message: 'Must be longer that 3 characters and shorter than 100'})
    readonly name: string;

    @ApiProperty({example: 'First, get bricks', description: 'Task description'})
    @IsString({message:'Must be string'})
    @Length(3, 500, {message: 'Must be longer that 3 characters and shorter than 500'})
    readonly description: string;

    @ApiProperty({type: [TaskColumnValueDto], description: 'Column values for the task', required: false})
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>TaskColumnValueDto)
    @IsOptional()
    readonly values?: TaskColumnValueDto[];
}