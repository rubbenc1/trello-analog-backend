import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './tasks.model';
import { Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ChangeTaskPositionDto } from './dto/change-task-position.dto';
import { ChangeTaskPositionBtwListsDto } from './dto/change-task-position-btwLists.dto';
import { Lists } from 'src/lists/lists.model';
import { TasksValuesService } from 'src/tasks-values/tasks-values.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
        @InjectRepository(Lists) private listsRepository: Repository<Lists>,
        private tasksValuesService: TasksValuesService
    ){}

    async createTask(taskDto:TaskDto, listId: number){

        const list = await this.listsRepository
        .createQueryBuilder('list')
        .where('list.id=:listId', {listId})
        .getOne()

        if (!list) {
            throw new NotFoundException(`List with ID ${listId} not found`);
        }

        // Determine the last position
        const highestPosition = await this.tasksRepository
        .createQueryBuilder('task')
        .where('task.listId=:listId', {listId})
        .orderBy('position', 'DESC')
        .getOne();

        const newPosition = highestPosition ? highestPosition.position + 1: 1;


        const newTask = this.tasksRepository.create({
            ...taskDto, position: newPosition, listId: listId
        })
        
        try{
           const savedTask = await this.tasksRepository.save(newTask);
           
           // Add values to tasks columns
           if(taskDto.values && taskDto.values.length > 0){
            for (const valueDto of taskDto.values) {
                await this.tasksValuesService.createValue(
                    savedTask.id,
                    valueDto.columnId,
                    valueDto
                );
                }
           }
           return savedTask
        }catch(error){
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new ConflictException('Position of the task already exists in this list');
              }
            throw error;
        }
    }

    async updateTask(id: number, taskDto: UpdateTaskDto){
        try {
            const result = await this.tasksRepository.update(id, {name:taskDto.name,description: taskDto.description});

            if(result.affected === 0){
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            if(taskDto.values && taskDto.values.length > 0){
                for(const valueDto of taskDto.values){
                    if(valueDto.optionId){
                        await this.tasksValuesService.updateValue(valueDto.valueId, { optionId: valueDto.optionId });
                    }else {
                        await this.tasksValuesService.updateValue(valueDto.valueId, {value: valueDto.value});
                    }
                }
           }

           const updatedTask = await this.tasksRepository.findOne({where: {id}});
           if (!updatedTask) {
               throw new NotFoundException(`Task with ID ${id} not found`);
           }
           return updatedTask;

        }catch(error){
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new ConflictException('Position of the task already exists in this list');
              }
            throw error;
        }
    }

    async changeTaskPositionWithinList(taskId: number, changePosition: ChangeTaskPositionDto){
        const {newPosition} = changePosition;
        const taskToMove = await this.tasksRepository.findOne({where:{id: taskId}})
        if(!taskToMove){
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }

        const {listId, position: oldPosition} = taskToMove;
        const tasks = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.listId=:listId', {listId})
            .orderBy('position', 'ASC')
            .getMany();
        
        if(newPosition < 1 || newPosition > tasks.length){
            throw new Error(`Invalid position: ${newPosition}`);
        }

        // Setting all positions to null
        await this.tasksRepository
            .createQueryBuilder()
            .update(Tasks)
            .set({ position: null })
            .where('listId=:listId', {listId})
            .execute();
        
        // Updating positions

        for(let i =0; i<tasks.length; i++){
            const task = tasks[i];

            if(task.id === taskId){
                task.position = newPosition;
            }else if(oldPosition < newPosition && task.position > oldPosition && task.position <= newPosition) {
                task.position -= 1;
            } else if (oldPosition > newPosition && task.position >= newPosition && task.position < oldPosition) {
            task.position += 1;
            }
            await this.tasksRepository.save(task);
        }
        
    }
    async changeTaskPositionBetweenLists(taskId: number, changePositionBtwLists: ChangeTaskPositionBtwListsDto) {
        const { newListId, newPosition } = changePositionBtwLists;
        const taskToMove = await this.tasksRepository.findOne({ where: { id: taskId } });
    
        if (!taskToMove) {
            throw new NotFoundException(`Task with ID ${taskId} not found`);
        }
    
        const { listId: oldListId, position: oldPosition } = taskToMove;
    
        if (newListId === oldListId) {
            throw new Error('New list ID must be different from the current list ID');
        }
    
        const tasksInNewList = await this.tasksRepository
            .createQueryBuilder('task')
            .where('task.listId = :newListId', { newListId })
            .orderBy('task.position', 'ASC')
            .getMany();
    
        // Calculate the new position considering the tasks in the new list
        let newPositionCalculated = 1;
        if (tasksInNewList.length !== 0) {
            if (newPosition < 1 || newPosition > tasksInNewList.length + 1) {
                throw new Error(`Invalid position: ${newPosition}`);
            }
    
            // Update positions in the new list where necessary
            await this.tasksRepository
                .createQueryBuilder()
                .update(Tasks)
                .set({ position: () => 'position + 1' })
                .where('listId = :newListId', { newListId })
                .andWhere('position >= :newPosition', { newPosition })
                .execute();
    
            newPositionCalculated = newPosition;
        }
    
        // Update positions in the old list
        await this.tasksRepository
            .createQueryBuilder()
            .update(Tasks)
            .set({ position: () => 'position - 1' })
            .where('listId = :oldListId', { oldListId })
            .andWhere('position > :oldPosition', { oldPosition })
            .execute();
    
        // Assign the final new position and list ID to the task

        taskToMove.listId = newListId;
        taskToMove.position = newPositionCalculated;
        await this.tasksRepository.save(taskToMove);
    }
    

    async deleteTask(id: number){
        const listToDelete = await this.tasksRepository.findOne({ where: {id} });
        if (!listToDelete) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        const {position: deletedPosition, listId} = listToDelete;


        // Deleting the task from the repository
        await this.tasksRepository.delete(id);

        // Updating positions in a single query

        await this.tasksRepository
        .createQueryBuilder()
        .update(Tasks)
        .set({position: ()=>'position-1'})
        .where('listId = :listId', { listId })
        .andWhere('position > :deletedPosition',{deletedPosition})
        .execute()
    }

    async getTasksOfList(listId: number){
        const result = await this.tasksRepository.find({
            where:{listId: listId},
            relations: ['tasksValue.column', 'tasksValue', 'tasksValue.option']
        });
        if(result.length === 0){
            throw new NotFoundException(`There are no tasks for the given listId ${listId}`)
        }
        return result
    }
}
