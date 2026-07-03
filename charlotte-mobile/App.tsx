import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native';
import Login from './components/Login';
import DashBoard from './components/DashBoard';

export default function App() {

  // Change to actual token 
  const [ token, setToken ] = useState(false);


  // useEffect(() => (
  //   setToken(true)
  // ), [])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {token ? <DashBoard /> : <Login />}
          <StatusBar style="auto" />
        </View>
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
