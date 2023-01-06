import TokenSet from "../models/tokenSet";
import { getFromIDBStore, storeInIDBStore } from "../utils/indexedDBHelper";
import { noContentResponse, serializeResponse } from "./base";

interface TokenRepository {
  refreshAccessToken: (refreshToken: string) => Promise<TokenSet>;
  deleteRefreshToken: (refreshToken: string) => Promise<Response>;
  getTokenSet: () => Promise<TokenSet>;
  saveTokenSet: (tokenSet: TokenSet) => Promise<void>;
}

class RealTokenRepository implements TokenRepository {
  async refreshAccessToken(refreshToken: string) {
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);

    return fetch(`${process.env.REACT_APP_API_URL}/tokens/refresh`, {
      method: "POST",
      body: formData,
    }).then(serializeResponse<TokenSet>());
  }

  async deleteRefreshToken(refreshToken: string) {
    const formData = new FormData();
    formData.append("refresh_token", refreshToken);

    return fetch(`${process.env.REACT_APP_API_URL}/tokens/remove`, {
      method: "DELETE",
      body: formData,
    }).then(noContentResponse());
  }

  async getTokenSet() {
    return await getFromIDBStore("tokenset");
  }

  async saveTokenSet(tokenSet: TokenSet) {
    return await storeInIDBStore("tokenset", tokenSet);
  }
}

export const NewTokenRepository: () => TokenRepository = () =>
  new RealTokenRepository();

export default TokenRepository;
