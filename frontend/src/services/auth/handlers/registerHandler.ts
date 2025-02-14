import {Alert} from 'react-native';
import {register} from '../register';
import {registerErrorHandler} from './errorHandlers/registerErrorHandler';

export const registerHandler = async (
  email: string,
  password: string,
  confirmPassword: string,
  username: string,
) => {
  if (!email || !password || !confirmPassword) {
    Alert.alert('Error', 'Fill all the fields.');
    return -1;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords must match.');
    return -1;
  }
  try {
    const data = await register(username, email, password);
    if (data) {
      Alert.alert('Success', 'New account created.');
      return 0;
    } else {
      Alert.alert('Error with registration.');
      return -1;
    }
  } catch (error: unknown) {
    registerErrorHandler(error);
    return -1;
  }
};
