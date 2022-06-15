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
  category: keyof typeof Category;
  organizer: User["id"];
};

export enum Category {
  AI = "AI",
  MOBILE_DEVELOPMENT = "MOBILE_DEVELOPMENT",
  WEB_DEVELOPMENT = "WEB_DEVELOPMENT",
  DATA_SCIENCE = "DATA_SCIENCE",
}
