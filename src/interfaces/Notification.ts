interface INotification {
	_id: string;
	type: 'post' | 'friend';
	title: string;
	body: string;
	read: boolean;
	user: string;
	created_at: Date;
	resource: string;
}

export default INotification;
