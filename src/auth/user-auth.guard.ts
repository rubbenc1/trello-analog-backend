import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>  {
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
            const reqId = parseInt(req.params.userid);
            if(reqId !==user.id){
                throw new UnauthorizedException({ message: 'You do not have permission to get information' });
            }
            return true;
        }catch (error) {
            throw new UnauthorizedException({ message: `User is not authorized` });
            }
    }   

}
