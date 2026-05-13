import { UpdateBoardBoundaries } from "src/modules/boards/ports/boudaries/update-board.bundaries";

export class UpdateBoardCommand {
    constructor(public readonly data: UpdateBoardBoundaries.Input) {}
}