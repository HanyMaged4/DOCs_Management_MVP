import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
    getMe(user: User) {
        return user;
    }
}
