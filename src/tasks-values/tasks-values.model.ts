import { ApiProperty } from "@nestjs/swagger";
import { TasksColumnOptions } from "src/tasks-column-options/tasks-column-options.model";
import { TasksColumn } from "src/tasks-column/tasks-column.model";
import { Tasks } from "src/tasks/tasks.model";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'tasks-values'})
export class TasksValues{

    @ApiProperty({example: '1', description: 'value id'})
    @PrimaryGeneratedColumn()
    valueId: number;

    @ApiProperty({example: 'string', description: 'type of value'})
    @Column()
    type: 'string' | 'number';

    @ApiProperty({ example: 'John Doe', description: 'string value for the column', required: false })
    @Column({ nullable: true })
    stringValue: string;

    @ApiProperty({ example: 42, description: 'number value for the column', required: false })
    @Column({ type: 'float', nullable: true })
    numberValue: number;

    @ManyToOne(()=>TasksColumn, (column)=>column.tasksValue, {onDelete: 'CASCADE'})
    @JoinColumn({name:'columnId'})
    column: TasksColumn;
    @Column()
    columnId: number;

    @ManyToOne(()=> Tasks, (task)=>task.tasksValue, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'id'})
    task:Tasks;
    @Column()
    id: number;

    @ManyToOne(()=>TasksColumnOptions, (option)=>option.values, {onDelete: 'CASCADE', nullable: true})
    @JoinColumn({name: 'optionId'})
    option: TasksColumnOptions;
    @Column({nullable: true})
    optionId: number;

    setValue(value: string | number){
        if(typeof value === 'string'){
            this.type = 'string';
            this.stringValue = value;
            this.numberValue = null;
        }else if(typeof value === 'number'){
            this.type = 'number';
            this.stringValue = null;
            this.numberValue = value;
        }
    }

}