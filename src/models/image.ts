export default interface Image {
  url: string;
  width: number;
}

type ImageSize = "large" | "medium" | "small";

export const getImage = (images: Image[], size: ImageSize) => {
  if (!images) {
    return null;
  }

  const sortedImages = images.slice().sort((a, b) => b.width - a.width);
  switch (size) {
    case "large":
      return sortedImages[0];
    case "medium":
      return sortedImages.length > 1 ? sortedImages[1] : sortedImages[0];
    case "small":
      return sortedImages[sortedImages.length - 1];
  }
};
