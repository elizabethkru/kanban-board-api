import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ColumnOwnerGuard } from '../../common/guards/column-owner.guard';
import { CreateColumnDto } from './dto/create-column.dto';
import { CreateColumnCommand } from 'src/modules/columns/application/command/create-column/create-column.command';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { GetColumnsByBoardQuery } from 'src/modules/columns/application/queries/get-column-by-board/get-columns-by-board.query';
import { UpdateColumnCommand } from 'src/modules/columns/application/command/update-column/update-column.command';

@ApiTags('columns')
@ApiBearerAuth()
@Controller('columns')
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateColumnDto, @Request() req) {
    const command = new CreateColumnCommand(
      dto.title,
      dto.boardId,
      req.user.uuid,
    );
    return this.commandBus.execute(command);
  }

  @Get('board/:boardId')
  async getByBoard(@Param('boardId') boardId: string, @Request() req) {
    const query = new GetColumnsByBoardQuery(boardId, req.user.uuid);
    return this.queryBus.execute(query);
  }

  @Put(':columnId')
  @UseGuards(ColumnOwnerGuard)
  async update(
    @Param('columnId') columnId: string,
    @Body() dto: CreateColumnDto,
    @Request() req,
  ) {
    const command = new UpdateColumnCommand(columnId, dto.title, req.user.uuid);
    return this.commandBus.execute(command);
  }
}
