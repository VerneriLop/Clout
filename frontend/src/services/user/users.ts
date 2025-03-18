import axios from 'axios';
import {CustomImage} from '../image/images';
import {getAccessToken} from '../utils';

const API_URL = 'http://localhost:8000/api/users/';

export type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  num_followers?: number;
  num_following?: number;
  profile_picture_url?: string;
  num_posts?: number;
};

const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

instance.interceptors.request.use(async config => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const getUsers = async (): Promise<User[]> => {
  const response = await instance.get<User[]>('/');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await instance.get<User>(`${id}/`);
  return response.data;
};

export const updateUser = async (
  id: number,
  userData: Partial<User>,
): Promise<User> => {
  const response = await instance.put<User>(`${id}/`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await instance.delete(`${id}/`);
};

export const getImagesByUser = async (id: number): Promise<CustomImage[]> => {
  const response = await instance.get<CustomImage[]>(`${id}/images/`);
  return response.data;
};
/* not implemented in backend|
------------------------------------------------------------------------------
Todo: table for storing followers relations: id: PK, user_id1: FK, user_id2: FK;

/api/
    ├── users/
    │   ├── {id}/                  # Get, update, or delete a specific user
    │   ├── {id}/follow/           # Follow a user
    │   ├── {id}/unfollow/         # Unfollow a user
    │   ├── {id}/followers/        # Get list of followers for a user
    │   └── {id}/following/        # Get list of users a user is following
-----------------------------------------------------------------------------
export const getUserFollowers = async (id: number): Promise<CustomImage[]> => {
  const response = await instance.get<CustomImage[]>(`${id}/`);
  return response.data;
};

export const getUserFollowing = async (id: number): Promise<CustomImage[]> => {
  const response = await instance.get<CustomImage[]>(`${id}/`);
  return response.data;
};
*/
