import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { JWTGuard } from 'src/Auth/guards';
import { GetUser } from 'src/Auth/decorators/get-user.decorator';
import { CreateBookDto, UpdateBookDto } from './DTOs';

@UseGuards(JWTGuard)
@Controller('books')
export class BookController {
    constructor(private bookservice:BookService) {}
    
    @Post()
    createBook(@GetUser('user_id') userId: number, @Body() dto: CreateBookDto) {  
        return this.bookservice.createBook(userId, dto);
    }

    @Get()
    getBooks(
        @GetUser('user_id') userId: number,
        @Query('search') search?: string
    ) {
        if (search) {
            return this.bookservice.searchBooks(userId, search);
        }
        return this.bookservice.getBooksByUserId(userId);
    }
    
    @Get(':id')
    getBookById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('user_id') userId: number
    ) {
        return this.bookservice.getBookById(id, userId);
    }

    @Put(':id')
    updateBook(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateBookDto,
        @GetUser('user_id') userId: number
    ) {
        return this.bookservice.updateBook(id, dto, userId);
    }

    @Delete(':id')
    deleteBook(
        @Param('id', ParseIntPipe) id: number,
        @GetUser('user_id') userId: number
    ) {
        return this.bookservice.deleteBook(id, userId);
    }

}


/*
**Books**

- [ ]  GET /books/{id} → Get single book if no id return all books by owner
- [ ]  GET /books?search=keyword → Search books (by title/description)

*/