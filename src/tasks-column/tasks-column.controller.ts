import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TasksColumnService } from './tasks-column.service';
import { TasksColumn } from './tasks-column.model';
import { TasksColumnDto } from './dto/tasks-column.dto';
import { OwnerGuard } from 'src/auth/owner.guard';


@ApiTags('Tasks Column')
@Controller('projects/:projectId/tasksColumn')
export class TasksColumnController {

    constructor(
        private tasksColumnService: TasksColumnService
    ){}

    @ApiOperation({summary: 'Create tasks column'})
    @ApiResponse({status: 201, type: TasksColumn})
    @UseGuards(OwnerGuard)
    @Post()
    async createColumn(@Body() name: TasksColumnDto, @Param('projectId', ParseIntPipe) projectId: number){
        return this.tasksColumnService.createColumn(name, projectId);
    }

    @ApiOperation({summary: 'Update tasks column'})
    @ApiResponse({status: 200, type: TasksColumn})
    @UseGuards(OwnerGuard)
    @Put(':columnId')
    async updateColumn(@Body() name: TasksColumnDto, @Param('columnId', ParseIntPipe) columnId: number){
        return await this.tasksColumnService.updateColumn(name, columnId);
    }

    @ApiOperation({summary: 'Delete tasks column'})
    @ApiResponse({status: 200, type: TasksColumn})
    @UseGuards(OwnerGuard)
    @Delete(':columnId')
    async DeleteDateColumn(@Param('columnId', ParseIntPipe) columnId: number){
        return this.tasksColumnService.deleteColumn(columnId);
    }


    @ApiOperation({summary: 'Get tasks columns of a particular project'})
    @ApiResponse({status: 200, type: TasksColumn})
    @UseGuards(OwnerGuard)
    @Get()
    async getColumns(@Param('projectId', ParseIntPipe) projectId: number){
        return this.tasksColumnService.getTasksColumnsOfProject(projectId);
    }
}
