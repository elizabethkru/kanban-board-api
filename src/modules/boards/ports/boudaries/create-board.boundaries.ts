export namespace CreateBoardBoundaries {
  export interface Input {
    title: string;
    userId: string;
  }

  export interface Output {
    id: string;
    title: string;
    createdAt: string;
  }
}