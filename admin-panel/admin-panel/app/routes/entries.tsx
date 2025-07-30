import {useEffect} from 'react';

import {useSelector} from 'react-redux';
import {
  type LoaderFunctionArgs,
  redirect,
  useNavigate,
  useParams,
} from 'react-router';
import {logoutAndReset} from '~/redux/slices/authSlice';
import type {RootState} from '~/redux/store/store';

import type {Route} from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    {title: 'Admin Dashboard'},
    {name: 'description', content: 'Welcome to clout enterprises. '},
  ];
}

export default function Competition() {
  const {id} = useParams();

  return (
    <div>
      {' '}
      <p>{id}</p>{' '}
    </div>
  );
}
