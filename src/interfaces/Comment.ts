import { IUserMin } from "./User";

interface IComment {
  _id: string;
  post: string;
  user: IUserMin;
  text: string;
  created_at: Date;
}

export default IComment;
