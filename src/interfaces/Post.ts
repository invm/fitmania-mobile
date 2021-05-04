interface IPost {
  display?: 'friends' | 'all';
  group?: string;
  author?: string;
  sharedBy?: string[];
  text?: string;
  image?: string;
  event?: string;
  comments?: string[];
  likes?: string[];
  created_at?: Date;
}

export default IPost;
