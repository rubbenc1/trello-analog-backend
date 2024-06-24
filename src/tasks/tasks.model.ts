import { ApiProperty } from "@nestjs/swagger";
import { Lists } from "src/lists/lists.model";
import { TasksValues } from "src/tasks-values/tasks-values.model";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";


@Entity({name: 'tasks'})
@Unique(['list', 'position'])
export class Tasks {

    @ApiProperty({example: '1', description: 'ID'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'Step 1', description: 'Task name...'})
    @Column({nullable: false})
    name: string;

    @ApiProperty({example: 'First, get bricks', description: 'Task description'})
    @Column({nullable: false})
    description: string;

    @ApiProperty({example: '3', description: 'Task position among tasks in the list'})
    @Column({nullable: true})
    position: number;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type:'timestamp'})
    updatedAt: Date;

    @ManyToOne(()=> Lists, (list)=>list.tasks, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'listId'})
    list: Lists
    @Column()
    listId: number;

    @OneToMany(()=>TasksValues, (value)=>value.task, {cascade: true})
    tasksValue: TasksValues[];
}