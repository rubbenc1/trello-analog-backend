import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksColumnOptionsService } from './tasks-column-options.service';
import { TasksColumnOptions } from './tasks-column-options.model';
import { CreateOptionsDto } from './dto/create-options.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ColumnOwnerGuard } from 'src/auth/column-owner.guard';


@ApiTags('Tasks Column Options')
@Controller('column-options/columns/:columnId')
export class TasksColumnOptionsController {

    constructor(
        private taskColumOptionsService: TasksColumnOptionsService
    ){}

    @ApiOperation({summary: 'Create tasks column options'})
    @ApiResponse({status: 201, type: TasksColumnOptions})
    @UseGuards(ColumnOwnerGuard)
    @Post()
    async createOptions(@Param('columnId', ParseIntPipe) columnId: number, @Body()options: CreateOptionsDto){
        return await this.taskColumOptionsService.createColumnOptions(columnId, options.options)
    }

    @ApiOperation({summary: 'Update the option of the task column'})
    @ApiResponse({status: 200, type: TasksColumnOptions})
    @UseGuards(ColumnOwnerGuard)
    @Put('options/:optionId')
    async updateOption(@Param('optionId', ParseIntPipe) optionId: number, @Body() optionName: UpdateOptionDto){
        return await this.taskColumOptionsService.updateOption(optionName,optionId)
    }

    
    @ApiOperation({summary: 'Delete the option of the task column'})
    @ApiResponse({status: 200, type: TasksColumnOptions})
    @UseGuards(ColumnOwnerGuard)
    @Delete('options/:optionId')
    async deleteOption(@Param('optionId', ParseIntPipe) optionId: number){
        return this.taskColumOptionsService.deleteOption(optionId)
    }

    @ApiOperation({summary: 'Get tasks column options'})
    @ApiResponse({status: 200, type: TasksColumnOptions})
    @UseGuards(ColumnOwnerGuard)
    @Get()
    async getOptions(@Param('columnId', ParseIntPipe) columnId: number){
        return this.taskColumOptionsService.getOptions(columnId)
    }
}
