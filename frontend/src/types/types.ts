export type LikeType = {
  id: number;
  user_id: number;
  image_id: number;
  created_at: string;
};

export type CustomUser = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string;
  num_followers: number;
  num_following: number;
  profile_picture_url: string;
  num_posts: number;
};

export type PostType = {
  id: number;
  owner: CustomUser;
  owner_id: string;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  created_at: string;
  is_visible: boolean;
  num_likes: number | null;
  num_comments: number | null;
};

export type CommentType = {
  id: number;
  user_id: number;
  image_id: number;
  comment: string;
  created_at: string;
};

export type FollowType = {
  id: number;
  user_id1: number;
  user_id2: number;
};

export type ProfileType = CustomUser & {
  num_followers: number;
  num_following: number;
};

export type ProfilePostsType = {
  data: PostType[];
  count: number;
};

/*{
  "data": [
    {
      "email": "user@example.com",
      "username": "string",
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "first_name": "string",
      "last_name": "string",
      "bio": "string",
      "profile_picture_url": "string"
    }
  ],
  "count": 0
}*/
