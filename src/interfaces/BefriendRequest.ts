import IUser from './User';

interface IBefriendRequest {
	_id: string;
	from: IUser;
	to: IUser;
	state: string;
}
export default IBefriendRequest;
