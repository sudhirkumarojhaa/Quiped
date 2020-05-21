import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet,ImageBackground} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCode,
} from '@react-native-community/google-signin';
import {styles} from '../design/style'
const Login = ({navigation}) => {
  const [user, setUser] = useState('sagar');

  useEffect(() => {
    config();
    console.log(user);
  }, []);

  const config = () => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '780974138254-66frntha8sn059pgi0n63giffmeu6cii.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '',
    });
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo, 'working');
      setUser(userInfo);
      navigation.navigate('Dashboard',{userDetails:userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={styles.login}>
      <ImageBackground 
        source={{uri:require('../assets/background.jpeg')}}
        style={{width:100,height:100,resizeMode:"cover",justifyContent:"center",}}
      />
      <Text style={styles.heading}>Login</Text>
      <GoogleSigninButton
        style={{width: 192, height: 48,}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
      />
    </View>
  );
};



export default Login;
