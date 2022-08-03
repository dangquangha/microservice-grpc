import { IUser } from "./user.interface";

export interface IPost {
    id?: string;
    title: string;
    content: string;
    userId: IUser;
  }