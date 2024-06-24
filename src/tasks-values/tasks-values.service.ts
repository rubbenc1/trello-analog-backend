import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksValues } from './tasks-values.model';
import { Repository } from 'typeorm';
import { TasksValuesDto } from './dto/tasks-values.dto';
import { Tasks } from 'src/tasks/tasks.model';
import { TasksColumn } from 'src/tasks-column/tasks-column.model';
import { TasksColumnOptions } from 'src/tasks-column-options/tasks-column-options.model';

@Injectable()
export class TasksValuesService {
    constructor(
        @InjectRepository(TasksValues) private tasksValuesRepository: Repository<TasksValues>,
        @InjectRepository(Tasks) private tasksRepository: Repository <Tasks>,
        @InjectRepository(TasksColumn) private tasksColumnsRepository: Repository <TasksColumn>,
        @InjectRepository(TasksColumnOptions) private tasksColumnOptionsRepository: Repository <TasksColumnOptions>
        ){}
    
    async createValue(taskId: number, columnId: number, valueDto: TasksValuesDto){
        // Verify the task exists
        const task = await this.tasksRepository.findOne({where: {id: taskId}});
        if (!task) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }

        // Verify the column exists
        const column = await this.tasksColumnsRepository.findOne({where:{columnId}});
        if (!column) {
            throw new NotFoundException(`Column with ID ${columnId} not found`);
        }

        const {value, optionId} = valueDto;
        const tasksValue = new TasksValues;
        tasksValue.id = taskId;
        tasksValue.columnId = columnId;
        if (optionId) {
            const option = await this.tasksColumnOptionsRepository.findOne({where: {optionId}});
            if (!option) {
                throw new NotFoundException(`Option with ID ${optionId} not found`);
            }
            tasksValue.optionId = optionId;
            tasksValue.stringValue = null;
            tasksValue.numberValue = null;
            tasksValue.type = 'number'; 
        } else {
            tasksValue.setValue(value);
            tasksValue.optionId = null;
        }

        return await this.tasksValuesRepository.save(tasksValue);
    }

    async updateValue(valueId: number, valueDto: TasksValuesDto){
        const tasksValue = await this.tasksValuesRepository.findOne({ where: { valueId } });
        if (!tasksValue) {
            throw new NotFoundException(`Value with ID ${valueId} not found`);
        }

        const { value, optionId } = valueDto;
        if (optionId) {
            const option = await this.tasksColumnOptionsRepository.findOne({where: {optionId}});
            if (!option) {
                throw new NotFoundException(`Option with ID ${optionId} not found`);
            }
            tasksValue.optionId = optionId;
        }else{
            tasksValue.setValue(value);
        }
        return await this.tasksValuesRepository.save(tasksValue);
    }

    async deleteValue(valueId: number){
        const result = await this.tasksValuesRepository.delete(valueId);
        if(result.affected === 0){
            throw new NotFoundException(`Value with ID ${valueId} not found`)
        }
    }

    async getTaskValues(taskId: number){
        const result = await this.tasksValuesRepository.find({
            where:{id: taskId}
        });
        if(result.length === 0){
            throw new NotFoundException(`There are no values for the given task id ${taskId}`)
        }
        return result
    }
}
