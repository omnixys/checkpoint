import {
  Channel,
} from "./notification-enum.type";



export type Template = {
  id: string;
  key: string;
  channel: Channel;
  locale: string;
  title: string;
  body: string;
  variables: any;
  category: string;
  isActive: boolean;
  version: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
