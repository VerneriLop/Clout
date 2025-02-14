import axios from 'axios';
import {Alert} from 'react-native';

export const registerErrorHandler = (error: unknown): void => {
  const errorMessages: string[] = [];
  if (error instanceof axios.AxiosError && error.response) {
    const errorData = error.response.data;
    if (errorData?.email) {
      console.warn('registration: email', errorData.email);
      errorMessages.push(errorData.email[0]);
      //throw Error(errorData.email);
    }
    if (errorData?.username) {
      console.warn('registration: username', errorData.username);
      errorMessages.push(errorData.username[0]);
      // user input alert
      // clear user input field
    }
    if (errorData?.password) {
      // TODO: password validation
      console.warn('registration: password (not implemented)');
      errorMessages.push(errorData.password);
    }
  } else {
    console.warn('registration, not axioserror', error);
  }
  errorMessages.forEach(x => Alert.alert(x)); //Alert.alert(errorMessages.join('\n'));
};
