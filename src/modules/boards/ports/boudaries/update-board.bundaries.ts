export namespace UpdateBoardBoundaries {
  export interface Input {
    id: string,
    title: string;
    userId: string;
  }

  export interface Output {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  }
}