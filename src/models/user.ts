import Image from "./image";

export default interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  images: Image[];
}