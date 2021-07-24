import IComment from './Comment';
import { IUserMin } from './User';

interface IEvent {
  startDate: Date;
  eventType: 'Running' | 'Biking' | 'Soccer' | 'Basketball' | 'Rugby' | 'Hiking' | 'Tennis';
  participants: IUserMin[];
  limitParticipants: number;
  pace: string;
  openEvent: boolean;
  rejectedParticipants: IUserMin[];
  pendingApprovalParticipants: IUserMin[];
  created_at: Date;
  location: { type: string; coordinates: number[] };
}

interface IPost {
  _id: string;
  display: 'friends' | 'all';
  group?: string;
  author: IUserMin;
  sharedBy: string[];
  text?: string;
  image?: string;
  event?: IEvent;
  comments: IComment[];
  likes: string[];
  created_at: Date;
}

export interface ICreatePost {
  _id?: string;
  display?: 'friends' | 'all';
  group?: string;
  author?: IUserMin;
  sharedBy?: string[];
  text?: string;
  image?: string;
  event?: string;
  comments?: string[];
  likes?: string[];
  created_at?: Date;
}

export default IPost;
