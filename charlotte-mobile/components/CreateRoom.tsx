import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BouncePressable from './BouncePressable';
import AppText from './AppText';

import { jwtDecode } from "jwt-decode";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

type CreateRoomRouteProp = NativeStackScreenProps<
  RootStackParamList,
  "CreateRoom"
>["route"];

type TokenPayload = {
  user_id: number;
  username: string;
  email: string;
  exp: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function CreateRoom() {
  
  
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CreateRoomRouteProp>();
  
  const { token } = route.params;
  const userInfo = jwtDecode<TokenPayload>(token);

    useEffect(() => {
      console.log(userInfo.email, 'create room token')
    }, [token])

    const [ roomInfo, setRoomInfo ] = useState({
        name: '',
        admin: '',
    });

  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Pressable onPress={() => navigation.goBack()}>
                    <AppText>Cancel</AppText>
                </Pressable>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0C0D8',
  },
});

export default CreateRoom