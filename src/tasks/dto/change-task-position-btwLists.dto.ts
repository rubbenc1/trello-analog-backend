import { IsDefined, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeTaskPositionBtwListsDto {
  @ApiProperty({ example: 3, description: 'New position for the task' })
  @IsDefined()
  @IsInt()
  @Min(1)
  newPosition: number;

  @ApiProperty({ example: 2, description: 'New list ID for the task' })
  @IsDefined()
  @IsInt()
  newListId: number;
}
