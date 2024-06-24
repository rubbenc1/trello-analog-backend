import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProjects } from "src/projects/user-projects.model";
import { TasksColumn } from "src/tasks-column/tasks-column.model";
import { Repository } from "typeorm";


@Injectable()
export class ColumnOwnerGuard implements CanActivate{

    constructor(
        @InjectRepository(UserProjects) private userProjectRepository: Repository<UserProjects>,
        @InjectRepository(TasksColumn) private taskColumnRepository: Repository <TasksColumn>,
        private jwtService: JwtService
    
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        try{
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException({ message: `User is not authorized` });
            }
            const user = this.jwtService.verify(token);
            req.user = user;
            const columnId = req.params.columnId;
            const columnDetails = await this.taskColumnRepository.findOne({where: {columnId}});
            if (!columnDetails) {
                throw new NotFoundException(`Column with ID ${columnId} not found`);
            }
            const projectId = columnDetails.projectId;
            const userProject = await this.userProjectRepository.findOne({where: {projectId, userId: user.id}});
            if(!userProject){
                throw new UnauthorizedException({ message: 'You do not have permission to modify this Column' });
            }
            return true;
        }catch (error) {
            throw new UnauthorizedException({ message: `User is not authorized` });
        }
    }
}