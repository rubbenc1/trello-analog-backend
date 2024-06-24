import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsInt, Min } from "class-validator";


export class ChangeTaskPositionDto{

    @ApiProperty({example: '1', description: 'Position number'})
    @IsDefined()
    @IsInt()
    @Min(1)
    newPosition: number;
}