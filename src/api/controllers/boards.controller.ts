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
import { GetBoardsQuery } from 'src/modules/boards/application/queries/get-boards/get-boards.query';
import { GetBoardQuery } from 'src/modules/boards/application/queries/get-board/get-board.query';
import { UpdateBoardCommand } from 'src/modules/boards/application/command/update-board/update-board.command';
import { DeleteBoardCommand } from 'src/modules/boards/application/command/delete-board/delete-board.command';

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
    const query = new GetBoardsQuery(req.user.uuid);
    return this.queryBus.execute(query);
  }

    @Get(':boardId')
  @ApiOperation({ summary: 'Получить одну доску по id' })
  @UseGuards(BoardOwnerGuard)
  async findOne(@Param('boardId') boardId: string, @Request() req) {
    const query = new GetBoardQuery(boardId, req.user.uuid);
    return this.queryBus.execute(query);
  }


@Put(':boardId')
@ApiOperation({ summary: 'Обновить доску' })
@UseGuards(BoardOwnerGuard)
async update(@Param('boardId') boardId: string, @Body() dto: UpdateBoardDto, @Request() req) {
  const command = new UpdateBoardCommand({ id: boardId, title: dto.title, userId: req.user.uuid });
  return this.commandBus.execute(command);
}

@Delete(':boardId')
@ApiOperation({ summary: 'Удалить доску' })
@UseGuards(BoardOwnerGuard)
async delete(@Param('boardId') boardId: string, @Request() req) {
  const command = new DeleteBoardCommand({ boardUuid: boardId, userId: req.user.uuid });
  await this.commandBus.execute(command);
  return { message: 'Board deleted successfully' };
}
}