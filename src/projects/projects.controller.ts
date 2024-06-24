import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProject } from './dto/create-project.dto';
import { Project } from './projects.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gurad';
import { OwnerGuard } from 'src/auth/owner.guard';
import { UserAuthGuard } from 'src/auth/user-auth.guard';


@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
    constructor(private projectService: ProjectsService){}

    @ApiOperation({summary: 'Create project'})
    @ApiResponse({status: 201, type: Project})
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() projectDto: CreateProject, @Req() req){
        const userId = req.user.id;
        return this.projectService.createProject(projectDto, userId)
    }

    @ApiOperation({summary:'Update project'})
    @ApiResponse({status: 200, type: Project})
    @UseGuards(OwnerGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body()updatedProject: CreateProject){
        return this.projectService.updateProject(id, updatedProject);
    }
    
    @ApiOperation({summary:'Delete project'})
    @ApiResponse({status: 200, type: Project})
    @UseGuards(OwnerGuard)
    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number){
        return this.projectService.deleteProject(id)
    }
    @ApiOperation({summary:'Get project'})
    @ApiResponse({status: 200, type: Project})
    @UseGuards(OwnerGuard)
    @Get(":id")
    getProject(@Param("id", ParseIntPipe) id: number){
        return this.projectService.getProject(id)
    }

    @ApiOperation({summary:'Get user projects'})
    @ApiResponse({status: 200, type: Project})
    @UseGuards(UserAuthGuard)
    @Get("ownprojects/:userid")
    getProjects(@Param("userid", ParseIntPipe) userid: number){
        return this.projectService.getUserProjects(userid)
    }

    @ApiOperation({summary: 'Get projects'})
    @ApiResponse({status: 200, type: [Project]})
    @Get()
    getAll(){
        return this.projectService.getAllProjects();
    }

}
