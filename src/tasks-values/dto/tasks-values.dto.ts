import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";


export class TasksValuesDto{

    @ApiProperty({ example: 'John Doe', description: 'The value of the column', required: false })
    @IsOptional()
    @ValidateIf(o => typeof o.value === 'string')
    @IsString()
    @ValidateIf(o => typeof o.value === 'number')
    @IsNumber()
    value?: string | number;

    @ApiProperty({ example: 3, description: 'The ID of the selected option', required: false })
    @IsOptional()
    @IsNumber()
    optionId?: number;
}