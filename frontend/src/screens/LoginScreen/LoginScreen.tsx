import React, {useState} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../redux/slices/userSlice'; // Importoi loginUser action
import {Alert} from 'react-native';
import Input from '../../components/Input/Input'; // Omat Input-komponentit
import Button from '../../components/Button/Button'; // Omat Button-komponentit
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';
import {Routes} from '../../navigation/Routes';

export const LoginScreen = ({navigation}: any): JSX.Element => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Virhe', 'Täytä kaikki kentät');
      return;
    }

    // Lähetetään kirjautumistietoja palvelimelle
    // Oletetaan, että tämä pyyntö on tehty ja saamme oikean vastauksen (käyttäjän tiedot ja token)
    const user = {id: '123', email: username}; // Tällä hetkellä vain mock-tyyppinen tieto
    const token = 'mock-jwt-token'; // Tässä tulee oikeasti serveriltä saatu token

    // Dispatchataan käyttäjä kirjautuneeksi Reduxiin
    dispatch(loginUser({user, token}));
    //navigation.navigate(Routes.Home); tämä piti poistaa koska valitti muuten navigointilogiikka on jo homesivulle MainNavigationissa
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={style.container}>
        <Text style={style.title}>Log in</Text>

        <Input
          label="Username"
          placeholder="erkki123"
          value={username}
          onChangeText={setUsername}
          style={style.input}
        />

        <Input
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={style.input}
        />

        <Button title="Log in" onPress={handleLogin} />

        <TouchableOpacity onPress={() => navigation.navigate(Routes.Register)}>
          <Text style={style.registerLink}>
            Don't have an account? Register here!
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
