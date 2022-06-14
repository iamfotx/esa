export interface User {
  email: string;
  password: string;
}

export enum Category {
  AI = "AI",
  MOBILE_DEVELOPMENT = "Mobile Development",
  WEB_DEVELOPMENT = "Web Development",
  DATA_SCIENCE = "Data Science",
}

export interface Event {
  title: string;
  description: string;
  date: string;
  isVirtual: boolean;
  address: string;
  category: Category;
}
