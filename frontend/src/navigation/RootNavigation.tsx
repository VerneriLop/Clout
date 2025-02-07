import React from 'react';
import {useSelector} from 'react-redux';
import {Authenticated, NonAuthenticated} from './MainNavigation';
import {RootState} from '../redux/store/store';

export const RootNavigation = () => {
  // Haetaan käyttäjän kirjautumistila Reduxista
  const user = useSelector((state: RootState) => state.user);

  // Jos käyttäjä on kirjautunut, näytetään Authenticated näkymä, muuten NonAuthenticated
  return user.isAuthenticated ? <Authenticated /> : <NonAuthenticated />;
};
