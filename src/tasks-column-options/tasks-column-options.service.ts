import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksColumnOptions } from './tasks-column-options.model';
import { TasksColumn } from 'src/tasks-column/tasks-column.model';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class TasksColumnOptionsService {

    constructor(
        @InjectRepository(TasksColumnOptions) private tasksColumnOptionsRepository: Repository<TasksColumnOptions>,
        @InjectRepository(TasksColumn) private taskColumnRepository: Repository<TasksColumn>
    ){}

    async createColumnOptions(columnId: number, options: string[]) {

        const column = await this.taskColumnRepository.findOne({ where: { columnId } });
        if (!column) {
            throw new NotFoundException(`Column with ID ${columnId} not found`);
        }

        const successfulOptions = [];
        const failedOptions = [];

        for (const option of options) {
            const newOption = this.tasksColumnOptionsRepository.create({
                optionName: option,
                columnId: columnId
            });

            try {
                await this.tasksColumnOptionsRepository.save(newOption);
                successfulOptions.push(newOption);
            } catch (error) {
                if (error.code === '23505') { // PostgreSQL unique violation error code
                    failedOptions.push({ option, error: 'Duplicate option' });
                } else {
                    failedOptions.push({ option, error: error.message });
                }
                // Log the error (or handle it appropriately)
                console.error(`Failed to save option '${option}': ${error.message}`);
            }
        }

        return {
            successfulOptions,
            failedOptions
        };
    }

    async updateOption(optionName: UpdateOptionDto, optionId: number){
        try {
            const result = await this.tasksColumnOptionsRepository.update(optionId, optionName);
            if(result.affected === 0){
                throw new NotFoundException(`Option with ID ${optionId} not found`);
            }
            const list = await this.tasksColumnOptionsRepository.findOne({where: {optionId}});
            return list;
        }catch(error){
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new ConflictException('Option name already exists in this column');
              }
              throw error;
        }
    }

    async deleteOption( optionId: number){
            const result = await this.tasksColumnOptionsRepository.delete(optionId);
            if(result.affected === 0){
                throw new NotFoundException(`Option with ID ${optionId} not found`)
            }
    }

    async getOptions(columnId: number){
        const result = await this.tasksColumnOptionsRepository.find({where:{columnId}});
        if(result.length === 0){
            throw new NotFoundException(`There are no options for the given column id ${columnId}`)
        }
        return result
    }
}
