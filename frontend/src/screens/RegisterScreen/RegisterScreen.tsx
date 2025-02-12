import React, {useState} from 'react';
import {View, Text, Alert, SafeAreaView} from 'react-native';
import Input from '../../components/Input/Input'; // Oletan että käytät omaa Input-komponenttia
import Button from '../../components/Button/Button'; // Oletan että käytät omaa Button-komponenttia
import style from './style';
import globalStyle from '../../assets/styles/globalStyle';
import {Routes} from '../../navigation/Routes';
import {register} from '../../services/auth/register';

export const RegisterScreen = ({navigation}: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Virhe', 'Täytä kaikki kentät');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Virhe', 'Salasanat eivät täsmää');
      return;
    }

    const data = await register(username, email, password);

    if (data) {
      // Rekisteröinti onnistui, siirrytään kirjautumissivulle
      Alert.alert('Onnistui', 'Käyttäjä luotu');
      navigation.navigate(Routes.Login);
    } else {
      // Virhe rekisteröinnissä
      Alert.alert('Error with registering');
    }
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={style.container}>
        <Text style={style.title}>Register</Text>

        <Input
          label="Username"
          placeholder="erkki123"
          value={username}
          onChangeText={setUsername}
          style={style.input}
        />
        <Input
          label="Email"
          placeholder="Email@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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
        <Input
          label="Confirm password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={style.input}
        />

        <Button title="Register" onPress={handleRegister} />
      </View>
    </SafeAreaView>
  );
};
