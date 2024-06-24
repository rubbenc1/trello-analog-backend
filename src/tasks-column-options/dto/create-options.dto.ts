import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, ArrayNotEmpty } from "class-validator";

export class CreateOptionsDto {
    @ApiProperty({ example: ["Low", "Medium", "High"], description: 'Array of options' })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    options: string[];
}
