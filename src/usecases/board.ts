import { BoardVisibility } from "../models/board";
import BoardRepository from "../repositories/board";
import TokenManager from "../utils/tokenManager";

interface BoardUsecase {
  createBoard(
    title: string,
    visibility: string,
    cover: string
  ): Promise<Response>;
  checkEmptyTitle: (title: string) => Promise<void>;
}

export enum BoardError {
  TitleEmpty = "title_empty",
  CoverEmpty = "cover_empty",
}

class RealBoardUsecase implements BoardUsecase {
  boardRepo: BoardRepository;
  tokenManager: TokenManager;

  constructor(boardRepo: BoardRepository, tokenManager: TokenManager) {
    this.boardRepo = boardRepo;
    this.tokenManager = tokenManager;
  }

  async createBoard(title: string, visibility: BoardVisibility, cover: string) {
    const errors: BoardError[] = [];

    try {
      await this.checkEmptyTitle(title);
    } catch (error) {
      errors.push(error as BoardError);
    }

    try {
      await this.checkEmptyCover(cover);
    } catch (error) {
      errors.push(error as BoardError);
    }

    if (errors.length > 0) {
      throw errors;
    }

    const accessToken = await this.tokenManager.getAccessToken();

    const resp = await this.boardRepo.create(
      title,
      visibility,
      cover
    )(accessToken);

    return resp;
  }

  async checkEmptyTitle(title: string) {
    if (title.length <= 0) throw BoardError.TitleEmpty;
  }

  async checkEmptyCover(cover: string) {
    if (cover.length <= 0) throw BoardError.CoverEmpty;
  }
}

export const NewBoardUsecase: (
  boardRepository: BoardRepository,
  tokenManager: TokenManager
) => BoardUsecase = (boardRepository, tokenManager) =>
  new RealBoardUsecase(boardRepository, tokenManager);

export default BoardUsecase;
