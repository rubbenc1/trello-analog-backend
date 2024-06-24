import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Tasks } from './tasks.model';
import { ChangeTaskPositionDto } from './dto/change-task-position.dto';
import { ChangeTaskPositionBtwListsDto } from './dto/change-task-position-btwLists.dto';
import { OwnerGuard } from 'src/auth/owner.guard';


@ApiTags('Tasks')
@Controller('projects/:projectId/lists/:listId/tasks')
export class TasksController {

    constructor(
        private tasksService: TasksService
    ){}

    @ApiOperation({summary: 'Create task'})
    @ApiResponse({status: 201, type: Tasks})
    @UseGuards(OwnerGuard)
    @Post()
    async createTask(@Param('listId', ParseIntPipe) listId: number, @Body() taskDto: TaskDto){
        return this.tasksService.createTask(taskDto,listId)
    }

    @ApiOperation({summary: 'Update task'})
    @ApiResponse({status: 200, type: Tasks})
    @UseGuards(OwnerGuard)
    @Put(':taskId')
    async updateTask(@Param('taskId', ParseIntPipe) taskId: number, @Body() taskDto: UpdateTaskDto){
        return await this.tasksService.updateTask(taskId,taskDto);
    }

    @ApiOperation({summary: 'Change task position within its list'})
    @ApiResponse({status: 200, type: Tasks})
    @UseGuards(OwnerGuard)
    @Patch(':taskId/positionWthList')
    async changePosition(@Param('taskId', ParseIntPipe) taskId: number, @Body()position:ChangeTaskPositionDto){
        return await this.tasksService.changeTaskPositionWithinList(taskId, position)
    }

    @ApiOperation({summary: 'Move the task to another list'})
    @ApiResponse({status: 200, type: Tasks})
    @UseGuards(OwnerGuard)
    @Patch(':taskId/anotherList')
    async changeTaskPositionBetweenLists(@Param('taskId', ParseIntPipe) taskId: number, @Body()changePositionBtwLists:ChangeTaskPositionBtwListsDto){
        return await this.tasksService.changeTaskPositionBetweenLists(taskId, changePositionBtwLists)
    }

    @ApiOperation({summary: 'Delete task'})
    @ApiResponse({status: 200, type: Tasks})
    @UseGuards(OwnerGuard)
    @Delete(':id')
    async deleteTask(@Param('id', ParseIntPipe) id: number){
        return await this.tasksService.deleteTask(id);
    }

    @ApiOperation({summary: 'Get tasks of a particular list'})
    @ApiResponse({status: 200, type: Tasks})
    @UseGuards(OwnerGuard)
    @Get()
    async getTasksOfList(@Param('listId', ParseIntPipe) listId: number){
        return this.tasksService.getTasksOfList(listId)
    }
 
}
