import axios from 'axios';

export const loginErrorHandler = (error: unknown, errorText: string): void => {
  console.warn(errorText);
  if (axios.isAxiosError(error)) {
    console.warn('Axios Error:', error.response?.data);
  } else if (error instanceof Error) {
    console.warn('JS Error:', error.message);
  } else {
    console.warn('Unknown Error:', error);
  }
};
