import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateList } from './dto/create-list.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Lists } from './lists.model';
import { changePosition } from './dto/change-position.dto';
import { OwnerGuard } from 'src/auth/owner.guard';

@ApiTags('Lists')
@Controller('projects/:projectId/lists')
export class ListsController {

    constructor(private listsService: ListsService){}

    @ApiOperation({summary: 'Create list'})
    @ApiResponse({status: 201, type: Lists})
    @UseGuards(OwnerGuard)
    @Post()
    async createList(@Param('projectId', ParseIntPipe) projectId: number, @Body() name: CreateList){
        return this.listsService.createList(name,projectId)
    }

    @ApiOperation({summary: 'Update list'})
    @ApiResponse({status: 200, type: Lists})
    @UseGuards(OwnerGuard)
    @Put(':listId')
    async updateList(@Param('listId', ParseIntPipe) listId: number, @Body() name: CreateList){
        return await this.listsService.updateList(name, listId)
    }

    @ApiOperation({summary: 'Change position'})
    @ApiResponse({status: 200, type: Lists})
    @UseGuards(OwnerGuard)
    @Patch(':listId/position')
    async changePosition(@Param('listId', ParseIntPipe) listId: number, @Body()position:changePosition){
        return await this.listsService.changePosition(listId, position)
    }

    @ApiOperation({summary:'Delete list'})
    @ApiResponse({status: 200, type: Lists})
    @UseGuards(OwnerGuard)
    @Delete(':listId')
    async deleteList(@Param('listId', ParseIntPipe) listId: number){
        return this.listsService.deleteList(listId)
    }

    @ApiOperation({summary:'Get the list of the project'})
    @ApiResponse({status: 200, type: Lists})
    @UseGuards(OwnerGuard)
    @Get(':listId')
    async getList(@Param('projectId', ParseIntPipe) projectId: number, @Param('listId', ParseIntPipe) listId: number){
        return this.listsService.getListProject(projectId, listId);
    }

    @ApiOperation({summary: 'Get project lists'})
    @ApiResponse({status: 200, type: Lists})
    @UseGuards(OwnerGuard)
    @Get()
    async getAllLists(@Param('projectId', ParseIntPipe) projectId: number){
        return this.listsService.getAllLists(projectId)
    }
}
