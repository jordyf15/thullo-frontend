import { fetchService, noContentResponse } from "./base";

interface BoardRepository {
  create: (
    title: string,
    visibility: string,
    cover: string
  ) => (accessToken: string) => Promise<Response>;
}

class RealBoardRepository implements BoardRepository {
  create(title: string, visibility: string, cover: string) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("visibility", visibility);
    formData.append("cover", cover);

    return (accessToken: string) =>
      fetchService(accessToken, {
        method: "POST",
        path: `boards`,
        body: formData,
      }).then(noContentResponse());
  }
}

export const NewBoardRepository: () => BoardRepository = () =>
  new RealBoardRepository();

export default BoardRepository;
