import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoardRepository } from '../../modules/boards/infrastructure/repository/board.repository';
import { BoardOwnerGuard } from '../../common/guards/board-owner.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('boards')
@ApiBearerAuth()
@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardRepository: BoardRepository) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую доску' })
  @ApiResponse({ status: 201, description: 'Доска создана' })
  async create(@Body() dto: CreateBoardDto, @Request() req) {
    const userId = req.user.uuid;
    return this.boardRepository.create(dto.title, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все доски пользователя' })
  async findAll(@Request() req) {
    const userId = req.user.uuid;
    return this.boardRepository.findAllByUserId(userId);
  }

  @Get(':boardId')
  @ApiOperation({ summary: 'Получить одну доску по id' })
  @UseGuards(BoardOwnerGuard)
  async findOne(@Param('boardId') boardId: string) {
    return this.boardRepository.findById(boardId);
  }

  @Put(':boardId')
  @ApiOperation({ summary: 'Обновить доску' })
  @UseGuards(BoardOwnerGuard)
  async update(@Param('boardId') boardId: string, @Body() dto: UpdateBoardDto) {
    return this.boardRepository.update(boardId, dto.title);
  }

  @Delete(':boardId')
  @ApiOperation({ summary: 'Удалить доску' })
  @UseGuards(BoardOwnerGuard)
  async delete(@Param('boardId') boardId: string) {
    await this.boardRepository.delete(boardId);
    return { message: 'Board deleted' };
  }
}