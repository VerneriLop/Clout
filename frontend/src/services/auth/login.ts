import axios from 'axios';
import {API_URL, ErrorResponse} from './utils';

type AuthResponse = {
  access: string;
  refresh: string;
};

export const login = async (
  username: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}login/`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw (error.response?.data as ErrorResponse) || error.message;
  }
};
