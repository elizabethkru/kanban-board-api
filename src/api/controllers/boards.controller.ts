import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TypeOrmBoardRepository } from '../../modules/boards/infrastructure/repository/board.repository';
import { BoardOwnerGuard } from '../../common/guards/board-owner.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardCommand } from 'src/modules/boards/application/command/create-board/create-board.command';
import { BoardResponseDto } from './output/create-board.output';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@ApiTags('boards')
@ApiBearerAuth()
@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую доску' })
  @ApiResponse({ status: 201, type: BoardResponseDto })
  async create(@Body() dto: CreateBoardDto, @Request() req) {
    const command = new CreateBoardCommand({
      title: dto.title,
      userId: req.user.uuid,
    });

    console.log(command)
    return await this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все доски пользователя' })
  async findAll(@Request() req) {
    // Пока оставим заглушку – позже добавим команду UpdateBoardCommand
    return { message: 'Not implemented yet' };
  }

  @Get(':boardId')
  @ApiOperation({ summary: 'Получить одну доску по id' })
  @UseGuards(BoardOwnerGuard)
  async findOne(@Param('boardId') boardId: string, @Request() req) {
    // Пока оставим заглушку – позже добавим команду UpdateBoardCommand
    return { message: 'Not implemented yet' };
  }

  @Put(':boardId')
  @ApiOperation({ summary: 'Обновить доску' })
  @UseGuards(BoardOwnerGuard)
  async update(@Param('boardId') boardId: string, @Body() dto: UpdateBoardDto) {
    // Пока оставим заглушку – позже добавим команду UpdateBoardCommand
    return { message: 'Not implemented yet' };
  }

  @Delete(':boardId')
  @ApiOperation({ summary: 'Удалить доску' })
  @UseGuards(BoardOwnerGuard)
  async delete(@Param('boardId') boardId: string) {
    // Позже добавим команду DeleteBoardCommand
    return { message: 'Not implemented yet' };
  }
}