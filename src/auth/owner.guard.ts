import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProjects } from "src/projects/user-projects.model";
import { Repository } from "typeorm";

@Injectable()
export class OwnerGuard implements CanActivate {
    constructor(
        @InjectRepository(UserProjects) private userProjectRepository: Repository<UserProjects>,
        private jwtService: JwtService
    
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
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
            const projectId = req.params.id ?? req.params.projectId;
            const userProject = await this.userProjectRepository.findOne({where: {projectId, userId: user.id}});
            if(!userProject){
                throw new UnauthorizedException({ message: 'You do not have permission to modify this project' });
            }
            return true;
        }catch (error) {
            throw new UnauthorizedException({ message: `User is not authorized` });
        }
    }
}
