import { NewUserRepository } from "./repositories/user";
import UserUsecase, { NewUserUsecase } from "./usecases/user";

interface Usecases {
  user: UserUsecase;
}

interface Dependencies {
  usecases: Usecases;
}

const userRepo = NewUserRepository();

const userUsecase = NewUserUsecase(userRepo);

const dependencies: Dependencies = {
  usecases: {
    user: userUsecase,
  },
};

export default dependencies;
