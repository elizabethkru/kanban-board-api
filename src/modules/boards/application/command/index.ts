import { CreateBoardHandler } from "./create-board/create-board.handler";
import { DeleteBoardHandler } from "./delete-board/delete-board.handler";
import { UpdateBoardHandler } from "./update-board/update-board.handler";

export const commandHandlers = [
    CreateBoardHandler,
    DeleteBoardHandler,
    UpdateBoardHandler
]