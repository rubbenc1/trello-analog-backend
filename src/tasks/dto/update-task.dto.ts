import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class TaskColumnValueUpdateDto {
    @ApiProperty({example: 1, description: 'Column Id'})
    @IsNumber()
    valueId: number;

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


export class UpdateTaskDto{

    @ApiProperty({example: 'Step 1', description: 'Task name'})
    @IsString({message:'Must be string'})
    @Length(3, 100, {message: 'Must be longer that 3 characters and shorter than 100'})
    name?: string;

    @ApiProperty({example: 'First, get bricks', description: 'Task description'})
    @IsString({message:'Must be string'})
    @Length(3, 500, {message: 'Must be longer that 3 characters and shorter than 500'})
    description?: string;

    @ApiProperty({type: [TaskColumnValueUpdateDto], description: 'Column values for the task', required: false})
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>TaskColumnValueUpdateDto)
    @IsOptional()
    values?: TaskColumnValueUpdateDto[];
}