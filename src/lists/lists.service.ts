import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lists } from './lists.model';
import { Repository } from 'typeorm';
import { CreateList } from './dto/create-list.dto';
import { changePosition } from './dto/change-position.dto';

@Injectable()
export class ListsService {
    
    constructor(
        @InjectRepository(Lists) private listsRepository: Repository<Lists>
    ){}

    async createList(name: CreateList, projectId: number){
        const highestPosition = await this.listsRepository
        .createQueryBuilder('list')
        .where('list.projectId=:projectId', {projectId})
        .orderBy('list.position', 'DESC')
        .getOne();
        
        const newPosition = highestPosition ? highestPosition.position + 1: 1;

        const newList = this.listsRepository.create({
            ...name, projectId: projectId, position: newPosition
        });
        try {
            return await this.listsRepository.save(newList);
          } catch (error) {
            if (error.code === '23505') { // PostgreSQL unique violation error code
              throw new ConflictException('List name or position already exists in this project');
            }
            throw error;
          }
    }

    async updateList(name: CreateList, listId: number){
        try {
            const result = await this.listsRepository.update(listId, name);
            if(result.affected === 0){
                throw new NotFoundException(`List with ID ${listId} not found`);
            }
            const list = await this.listsRepository.findOne({where: {id: listId}});
            return list;
        }catch(error){
            if (error.code === '23505') { // PostgreSQL unique violation error code
                throw new ConflictException('List name or position already exists in this project');
              }
              throw error;
        }
    }

    async changePosition(listId: number, changePositionDto: changePosition) {
        const { newPosition } = changePositionDto;
        const currentListToMove = await this.listsRepository.findOne({ where: { id: listId } });
        
        if (!currentListToMove) {
            throw new NotFoundException(`List with ID ${listId} not found`);
        }

        const { projectId, position: oldPosition } = currentListToMove;

        const lists = await this.listsRepository
            .createQueryBuilder('list')
            .where('list.projectId = :projectId', { projectId })
            .orderBy('list.position', 'ASC')
            .getMany();

        if (newPosition < 1 || newPosition > lists.length) {
            throw new Error(`Invalid position: ${newPosition}`);
        }

        // Set all positions to null
        await this.listsRepository
            .createQueryBuilder()
            .update(Lists)
            .set({ position: null })
            .where('projectId = :projectId', { projectId })
            .execute();

        // Update positions correctly
        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];

            if (list.id === listId) {
                list.position = newPosition;
            } else if (oldPosition < newPosition && list.position > oldPosition && list.position <= newPosition) {
                list.position -= 1;
            } else if (oldPosition > newPosition && list.position >= newPosition && list.position < oldPosition) {
                list.position += 1;
            } 
            await this.listsRepository.save(list);
        }
    }

    async deleteList(listId: number) {
        const listToDelete = await this.listsRepository.findOne({ where: { id: listId } });
        if (!listToDelete) {
            throw new NotFoundException(`List with ID ${listId} not found`);
        }

        const {projectId, position: deletedPosition} = listToDelete;


        // Delete the list from the repository
        await this.listsRepository.delete(listId);

        // Update positions in a single query
        await this.listsRepository
            .createQueryBuilder()
            .update(Lists)
            .set({ position: () => 'position - 1' })
            .where('projectId = :projectId', { projectId })
            .andWhere('position > :deletedPosition', { deletedPosition })
            .execute();
    }
    
    async getListProject(projectId: number, listId: number){
        return await this.listsRepository.find({
            where: {projectId:projectId, id: listId}
        })
    }

    async getAllLists(projectId: number){
        return await this.listsRepository.find({where:{projectId}, relations:['tasks']});
    }
}
