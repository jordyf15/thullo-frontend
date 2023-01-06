import TokenRepository from "../repositories/token";

class TokenManager {
  tokenRepo: TokenRepository;

  constructor(tokenRepo: TokenRepository) {
    this.tokenRepo = tokenRepo;
  }

  async getAccessToken() {
    const tokenSet = await this.tokenRepo.getTokenSet();
    if (tokenSet === null) {
      return "";
    }

    const { expiresAt } = tokenSet;
    const currentMillis = new Date().getTime() / 1000;
    if (expiresAt > currentMillis) {
      return tokenSet.accessToken;
    }

    const newTokenSet = await this.tokenRepo.refreshAccessToken(
      tokenSet.refreshToken
    );

    await this.tokenRepo.saveTokenSet(newTokenSet);

    return newTokenSet.accessToken;
  }
}

export const NewTokenManager: (tokenRepo: TokenRepository) => TokenManager = (
  tokenRepo
) => new TokenManager(tokenRepo);

export default TokenManager;
