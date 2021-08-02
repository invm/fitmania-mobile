import { IUserMin } from './User';

interface IGroup {
  _id: string;
  title: string;
  sport: string;
  description?: string;
  admin: IUserMin;
  users: IUserMin[];
  created_at: Date;
}
export default IGroup;
