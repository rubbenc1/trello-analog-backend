import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksColumn } from './tasks-column.model';
import { Repository } from 'typeorm';
import { TasksColumnDto } from './dto/tasks-column.dto';
import { Project } from 'src/projects/projects.model';

@Injectable()
export class TasksColumnService {

    constructor(
        @InjectRepository(TasksColumn) private tasksColumnRepository: Repository<TasksColumn>,
        @InjectRepository(Project) private projectRepository: Repository<Project> 
    ){}

    async createColumn(name: TasksColumnDto, projectId: number){
        const project = await this.projectRepository.findOne({where: {id: projectId}});
        if(!project){
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }
        const tasksColumn = this.tasksColumnRepository.create(
            {...name, projectId: projectId}
        )
        await this.tasksColumnRepository.save(tasksColumn);
        return tasksColumn;

    }

    async updateColumn(name: TasksColumnDto, columnId: number){
        const column = await this.tasksColumnRepository.update(columnId, name);
        if(column.affected === 0){
            throw new NotFoundException(`Column with ID ${column} not found`);
        }
        const updatedColumn = await this.tasksColumnRepository.findOneBy({columnId});
        return updatedColumn;
    }

    async deleteColumn(columnId: number){
        const result = await this.tasksColumnRepository.delete(columnId);
        if(result.affected === 0){
            throw new NotFoundException(`Column with ID ${columnId} not found`)
        }
    }


    async getTasksColumnsOfProject(projectId: number){
        const result = await this.tasksColumnRepository.find({
            where:{projectId: projectId},
            relations: ['tasksValue', 'tasksValue.option']
        });
        if(result.length === 0){
            throw new NotFoundException(`There are no tasks columns for the given projectId ${projectId}`)
        }
        return result
    }

}
