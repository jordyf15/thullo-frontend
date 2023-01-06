import { NewBoardRepository } from "./repositories/board";
import { NewTokenRepository } from "./repositories/token";
import { NewUnsplashRepository } from "./repositories/unsplash";
import { NewUserRepository } from "./repositories/user";
import BoardUsecase, { NewBoardUsecase } from "./usecases/board";
import UnsplashUsecase, { NewUnsplashUsecase } from "./usecases/unsplash";
import UserUsecase, { NewUserUsecase } from "./usecases/user";
import { NewTokenManager } from "./utils/tokenManager";

interface Usecases {
  user: UserUsecase;
  board: BoardUsecase;
  unsplash: UnsplashUsecase;
}

interface Dependencies {
  usecases: Usecases;
}

const userRepo = NewUserRepository();
const boardRepo = NewBoardRepository();
const tokenRepo = NewTokenRepository();
const unsplashRepo = NewUnsplashRepository();

const tokenManager = NewTokenManager(tokenRepo);

const userUsecase = NewUserUsecase(userRepo);
const boardUsecase = NewBoardUsecase(boardRepo, tokenManager);
const unsplashUsecase = NewUnsplashUsecase(unsplashRepo);

const dependencies: Dependencies = {
  usecases: {
    user: userUsecase,
    board: boardUsecase,
    unsplash: unsplashUsecase,
  },
};

export default dependencies;
