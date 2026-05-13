import { DeleteBoardBoundaries } from "src/modules/boards/ports/boudaries/delete-board.boundaries";


export class DeleteBoardCommand{
    constructor(public readonly data: DeleteBoardBoundaries.Input){}
}