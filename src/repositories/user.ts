import DataMetaResponse from "../models/dataMetaResponse";
import TokenSet from "../models/tokenSet";
import User from "../models/user";
import { serializeResponse } from "./base";

interface UserRepository {
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<DataMetaResponse<User, TokenSet>>;
  login: (
    email: string,
    password: string
  ) => Promise<DataMetaResponse<User, TokenSet>>;
  loginWithGoogle: (token: string) => Promise<DataMetaResponse<User, TokenSet>>;
}

class RealUserRepository implements UserRepository {
  async register(
    name: string,
    username: string,
    email: string,
    password: string
  ) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    return fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      body: formData,
    }).then(serializeResponse<DataMetaResponse<User, TokenSet>>());
  }

  async login(email: string, password: string) {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    return fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      body: formData,
    }).then(serializeResponse<DataMetaResponse<User, TokenSet>>());
  }

  async loginWithGoogle(token: string) {
    const formData = new FormData();
    formData.append("token", token);

    return fetch(`${process.env.REACT_APP_API_URL}/login/google`, {
      method: "POST",
      body: formData,
    }).then(serializeResponse<DataMetaResponse<User, TokenSet>>());
  }
}

export const NewUserRepository: () => UserRepository = () =>
  new RealUserRepository();

export default UserRepository;
