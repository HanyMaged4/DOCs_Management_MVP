import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto,UpdateBookDto } from './DTOs';
import * as argon from 'argon2';

@Injectable()
export class BookService {
    constructor(private prisma : PrismaService){}

    async createBook(userId: number , Dto: CreateBookDto) {
        const cur_user = await this.prisma.user.findUnique({
            where:{ user_id: userId}
        }); 
        if (!cur_user) {
            throw new NotFoundException('User have been deleted');
        }
        const existingBook = await this.prisma.book.findFirst({
            where: {
                title: Dto.title,
                owner_id: userId
            }
        });
        if (existingBook) {
            throw new ConflictException('Book already exists');
        }
        const hashedSecPassword = Dto.sec_password ? await argon.hash(Dto.sec_password) : null;
        const book = await this.prisma.book.create({
            data: {
                title: Dto.title,
                description: Dto.description,
                sec_password: hashedSecPassword,
                owner_id: userId
            }
        });
        const { sec_password, ...res } = book;
        return res;
    }

    async getBookById(id: number , userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { book_id: id }
        });
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        if (book.owner_id !== userId) {
            throw new ConflictException('You are not the owner of this book');
        }
        const { sec_password, ...res } = book;
        return res;
    }

    async updateBook(id: number, dto: UpdateBookDto , userId: number) {
        
        const book = await this.prisma.book.findUnique({
            where: { book_id: id }
        });

        if (!book) {
            throw new NotFoundException('Book not found');
        }
        
        if (book.owner_id !== userId) {
            throw new ConflictException('You are not the owner of this book');
        }

        const updatedBook = await this.prisma.book.update({
            where: { book_id: id },
            data: {
                title: dto.title,
                description: dto.description,
                sec_password: dto.sec_password ? await argon.hash(dto.sec_password) : book.sec_password
            }
        });
        const { sec_password, ...res } = updatedBook;
        return res;
    }


    async deleteBook(id: number , userId: number) {
        const book = await this.prisma.book.findUnique({
            where: { book_id: id }
        });
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        if (book.owner_id !== userId) {
            throw new ConflictException('You are not the owner of this book');
        }

        await this.prisma.book.delete({
            where: { book_id: id }
        });
        return { message: 'Book deleted successfully' };
    }


    async getBooksByUserId(userId: number) {
        const books = await this.prisma.book.findMany({
            where: { owner_id: userId }
        });
        if (!books || books.length === 0) {
            throw new NotFoundException('No books found for this user');
        }
        books.forEach(book => {
            const { sec_password, ...rest } = book;
            Object.assign(book, rest);
        });
        return books;
    }


    async searchBooks(userId: number, keyword: string) {
        // Input validation
        if (!keyword || keyword.trim().length === 0) {
            throw new BadRequestException('Search keyword cannot be empty');
        }
    
        const trimmedKeyword = keyword.trim();
    
        const books = await this.prisma.book.findMany({
            where: {
                owner_id: userId, 
                OR: [
                    { title: { contains: trimmedKeyword, mode: 'insensitive' } },
                    { description: { contains: trimmedKeyword, mode: 'insensitive' } }
                ]
            },
            select: {
                book_id: true,
                title: true,
                description: true,
                owner_id: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    
        return {
            message: books.length > 0 
                ? `Found ${books.length} book(s) matching "${trimmedKeyword}"` 
                : `No books found matching "${trimmedKeyword}"`,
            count: books.length,
            books: books
        };
    }
}
