import { IUserMin } from "./User";

export interface IEvent {
  startDate: Date;
  eventType:
    | 'Running'
    | 'Biking'
    | 'Soccer'
    | 'Basketball'
    | 'Rugby'
    | 'Hiking'
    | 'Tennis';
  participants: IUserMin[];
  limitParticipants: number;
  pace: string;
  openEvent: boolean;
  rejectedParticipants: IUserMin[];
  pendingApprovalParticipants: IUserMin[];
  created_at?: Date;
  coordinates: number[];
  address: string;
  initiator?: string;
}

export default IEvent;
