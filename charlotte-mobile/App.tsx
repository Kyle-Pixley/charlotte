import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import DashBoard from './components/DashBoard';
import CreateRoom from './components/CreateRoom';

export type RootStackParamList = {
  DashBoard: undefined;
  CreateRoom: {
    token: string;
  };
  Login: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {

  const DEV_TOKEN = process.env.EXPO_PUBLIC_DEV_TOKEN ?? null;

  const [ token, setToken ] = useState<string | null>(DEV_TOKEN);


  useEffect(() => {
    console.log('token changed', token);
  }, [token]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="DashBoard">
              {() => <DashBoard token={token} setToken={setToken} />}
            </Stack.Screen>

            <Stack.Screen name="CreateRoom" component={CreateRoom} />
          </>
        ) : (
          <Stack.Screen name="Login">
            {() => <Login setToken={setToken} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0C0D8',
  },
  inner: {
    flex: 1,
    width: '100%',
    backgroundColor: '#C0C0D8',
  }
});
