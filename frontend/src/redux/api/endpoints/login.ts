import {setCredentials} from '../../slices/authSlice';
import {apiSlice} from '../apiSlice';

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  refreshToken: null;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/login/access-token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }).toString(),
      }),
      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          dispatch(
            setCredentials({
              accessToken: data.access_token, // match FastAPI's return
              refreshToken: null, // not used yet
            }),
          );
        } catch (err) {
          console.error('Login failed', err);
        }
      },
    }),
  }),
});

export const {useLoginMutation} = authApi;
