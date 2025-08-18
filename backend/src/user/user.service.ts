import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'generated/prisma';
import { UpdateUserDto } from './DTos';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
    constructor(private prisma : PrismaService) {}
    getMe(user: User) {
        return user;
    }

    async putMe(userid: number, updateData: UpdateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { user_id: userid }
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        const cleanUpdateData = this.removeUndefined(updateData);

        if (Object.keys(cleanUpdateData).length === 0) {
            return this.getMe(existingUser);
        }

        // Hash passwords if they exist
        if (cleanUpdateData.password) {
            cleanUpdateData.password = await argon.hash(cleanUpdateData.password);
        }

        if (cleanUpdateData.sec_password) {
            cleanUpdateData.sec_password = await argon.hash(cleanUpdateData.sec_password);
        }

        const updatedUser = await this.prisma.user.update({
            where: { user_id: userid },
            data: cleanUpdateData,
            select: {
                user_id: true,
                email: true,
                username: true,
                join_at: true,
            }
        });

        return updatedUser;
    }




    // Helpers Funcs
    private removeUndefined(obj: any): any {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== undefined)
        );
    }
}
