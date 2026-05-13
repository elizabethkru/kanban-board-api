export namespace DeleteBoardBoundaries {
  export interface Input {
    boardUuid: string;
    userId: string;
  }

  export interface Output {
    success: boolean;
    message: string;
  }
}