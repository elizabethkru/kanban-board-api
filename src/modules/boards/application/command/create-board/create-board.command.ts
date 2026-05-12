import { CreateBoardBoundaries } from "src/modules/boards/ports/boudaries/create-board.boundaries";

export class CreateBoardCommand {
    constructor(public readonly data: CreateBoardBoundaries.Input) {}
}