import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksValuesService } from './tasks-values.service';
import { TasksValues } from './tasks-values.model';
import { TasksValuesDto } from './dto/tasks-values.dto';
import { ColumnOwnerGuard } from 'src/auth/column-owner.guard';

@ApiTags('Tasks column values')
@Controller('tasks-values/tasks/:taskId/columns/:columnId/values')
export class TasksValuesController {

    constructor(
        private tasksValuesServce: TasksValuesService
    ){}

    @ApiOperation({summary: 'Create value for the column'})
    @ApiResponse({status: 201, type: TasksValues})
    @Post()
    @UseGuards(ColumnOwnerGuard)
    async createColumnValue(@Param('taskId', ParseIntPipe) taskId: number,@Param('columnId', ParseIntPipe) columnId: number, @Body()value: TasksValuesDto){
        return this.tasksValuesServce.createValue(taskId,columnId,value)
    }

    @ApiOperation({summary: 'Update value for the column'})
    @ApiResponse({status: 200, type: TasksValues})
    @UseGuards(ColumnOwnerGuard)
    @Put(':valueId')
    async updateColumnValue(@Param('valueId', ParseIntPipe) valueId: number, @Body() value: TasksValuesDto){
        return await this.tasksValuesServce.updateValue(valueId, value)
    }

    @ApiOperation({summary: 'Delete value for the column'})
    @ApiResponse({status: 200, type: TasksValues})
    @UseGuards(ColumnOwnerGuard)
    @Delete(':valueId')
    async deleteColumnValue(@Param('valueId', ParseIntPipe) valueId: number){
        return await this.tasksValuesServce.deleteValue(valueId)
    }

    @ApiOperation({summary: 'Get values for the task'})
    @ApiResponse({status: 200, type: TasksValues})
    @Get('tasks/:taskId')
    async getTaskValues(@Param('taskId', ParseIntPipe) taskId: number){
        return await this.tasksValuesServce.getTaskValues(taskId);
    }

}
