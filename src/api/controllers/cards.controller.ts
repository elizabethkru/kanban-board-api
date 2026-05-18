import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CardOwnerGuard } from '../../common/guards/card-owner.guard';
import { GetCardQuery } from '../../modules/cards/application/queries/get-card/get-card.query';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CardResponseDto } from './dto/card-response.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { CreateCardCommand } from 'src/modules/cards/application/command/create-card/create-card.command';
import { GetCardsByColumnQuery } from 'src/modules/cards/application/queries/get-card-by-column/get-cards-by-column.query';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateCardCommand } from 'src/modules/cards/application/command/update-card/update-card.command';
import { DeleteCardCommand } from 'src/modules/cards/application/command/delete-card/delete-card.command';
import { MoveCardDto } from './dto/move-card.dto';
import { MoveCardCommand } from 'src/modules/cards/application/command/move-card/move-card.command';

@ApiTags('cards')
@ApiBearerAuth()
@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую карточку' })
  @ApiResponse({ status: 201, type: CardResponseDto })
  async create(@Body() dto: CreateCardDto, @Request() req) {
    const command = new CreateCardCommand(
      dto.title,
      dto.description,
      dto.columnId,
      req.user.uuid,
    );
    return this.commandBus.execute(command);
  }

  @Get('column/:columnId')
  @ApiOperation({ summary: 'Получить все карточки колонки' })
  async getByColumn(@Param('columnId') columnId: string, @Request() req) {
    const query = new GetCardsByColumnQuery(columnId, req.user.uuid);
    return this.queryBus.execute(query);
  }

  @Get(':cardId')
  @ApiOperation({ summary: 'Получить карточку по id' })
  @UseGuards(CardOwnerGuard)
  async findOne(@Param('cardId') cardId: string, @Request() req) {
    const query = new GetCardQuery(cardId, req.user.uuid);
    return this.queryBus.execute(query);
  }

  @Put(':cardId')
  @ApiOperation({ summary: 'Обновить карточку' })
  @UseGuards(CardOwnerGuard)
  async update(
    @Param('cardId') cardId: string,
    @Body() dto: UpdateCardDto,
    @Request() req,
  ) {
    const command = new UpdateCardCommand(
      cardId,
      dto.title,
      dto.description,
      req.user.uuid,
    );
    return this.commandBus.execute(command);
  }

  @Delete(':cardId')
  @ApiOperation({ summary: 'Удалить карточку' })
  @UseGuards(CardOwnerGuard)
  async delete(@Param('cardId') cardId: string, @Request() req) {
    const command = new DeleteCardCommand(cardId, req.user.uuid);
    await this.commandBus.execute(command);
    return { message: 'Card deleted successfully' };
  }

  @Put(':cardId/move')
  @ApiOperation({ summary: 'Переместить карточку' })
  @UseGuards(CardOwnerGuard)
  async move(
    @Param('cardId') cardId: string,
    @Body() dto: MoveCardDto,
    @Request() req,
  ) {
    const command = new MoveCardCommand(
      cardId,
      dto.targetColumnId,
      dto.newPosition,
      req.user.uuid,
    );
    return this.commandBus.execute(command);
  }
}
