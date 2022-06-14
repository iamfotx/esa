import type { ObjectId } from "mongoose";
type BaseEntity = {
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

export type User = BaseEntity & {
  email: string;
  password?: string;
};

export type Event = BaseEntity & {
  title: string;
  slug: string;
  description: string;
  isVirtual: boolean;
  address: string;
  date: Date;
  category: Category;
  organizer: User["id"];
};

export enum Category {
  AI = "AI",
  MOBILE_DEVELOPMENT = "Mobile Development",
  WEB_DEVELOPMENT = "Web Development",
  DATA_SCIENCE = "Data Science",
}
