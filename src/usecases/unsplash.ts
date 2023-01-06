import { UnsplashPhoto, UnsplashSearchResponse } from "../models/unsplash";
import UnsplashRepository from "../repositories/unsplash";

interface UnsplashUsecase {
  unsplashRepo: UnsplashRepository;
  listPhotos: (page: number, perPage: number) => Promise<UnsplashPhoto[]>;
  getPhoto: (id: string) => Promise<UnsplashPhoto>;
  searchForPhotos: (
    query: string,
    page: number,
    perPage: number
  ) => Promise<UnsplashSearchResponse>;
  getRandomPhoto: () => Promise<UnsplashPhoto>;
}

class RealUnsplashUsecase implements UnsplashUsecase {
  unsplashRepo: UnsplashRepository;

  constructor(unsplashRepo: UnsplashRepository) {
    this.unsplashRepo = unsplashRepo;
  }

  async listPhotos(page: number, perPage: number) {
    const resp = await this.unsplashRepo.listPhotos(page, perPage);

    return resp;
  }

  async getPhoto(id: string) {
    const resp = await this.unsplashRepo.getPhoto(id);

    return resp;
  }

  async searchForPhotos(query: string, page: number, perPage: number) {
    const resp = await this.unsplashRepo.searchForPhotos(query, page, perPage);

    return resp;
  }

  async getRandomPhoto() {
    const resp = await this.unsplashRepo.getRandomPhoto();

    return resp;
  }
}

export const NewUnsplashUsecase: (
  unsplashRepo: UnsplashRepository
) => UnsplashUsecase = (unsplashRepo) => new RealUnsplashUsecase(unsplashRepo);

export default UnsplashUsecase;
