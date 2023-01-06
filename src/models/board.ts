import Image from "./image";

export default interface Board {
  ID: string;
  Title: string;
  Description: string;
  Visibility: BoardVisibility;
  OwnerID: string;
  MemberIDs: string[];
  ListIDs: string[];
  Cover: BoardCover;
  CreatedAt: string;
  UpdatedAt: string;
}

interface BoardCover {
  PhotoID: string;
  Source: string;
  FocalPointY: number;
  Images: Image[];
}

export enum BoardVisibility {
  Public = "public",
  Private = "private",
}
