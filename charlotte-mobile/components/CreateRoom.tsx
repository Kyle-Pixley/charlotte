import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Pressable } from 'react-native';
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
      console.log(userInfo, 'create room token')
    }, [token])

    const [ roomInfo, setRoomInfo ] = useState({
        name: '',
        admin_id: userInfo.user_id,
    });

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    async function handleCreateChatRoom() {
        try {
            const response = await fetch(`${API_URL}/api/create_chatroom/`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify(roomInfo),
            });
            const data = await response.json();

            if(!response.ok){
                console.log("fail", data.error);
                return;
            }
            console.log('room created', data)
        } catch(error) {
            console.log("error", error)
        }
    };

  return (
    <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Pressable onPress={() => navigation.goBack()}>
                    <AppText>Cancel</AppText>
                </Pressable>
                <View style={styles.form}>
                  <View style={styles.textInputParent}>
                          <AppText style={styles.headerText}>Room Name</AppText>
                          <TextInput
                              editable
                              placeholder='Something'
                              onChangeText={(text) => setRoomInfo((prev) => ({...prev,name:text}))}
                              value={roomInfo.name}
                              style={styles.textInput}
                              autoCorrect={false}/>
                  </View>
                  <BouncePressable
                    onPress={() => handleCreateChatRoom()}
                    style={styles.toggleCreateRoomButton}>
                    <Text style={styles.toggleCreateRoomText}>Create Room</Text>
                  </BouncePressable>
                </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0C0D8',
  },
  form: {
      width: '100%',
      maxWidth: 420,
      alignSelf: 'center',
  },
  textInputParent: {
      marginBottom: 16,
  },
  headerText: {
      color: '#960018',
  },
  textInput: {
      height: 44,
      textAlignVertical: 'center',
      borderWidth: 2,
      backgroundColor: 'white',
      paddingHorizontal: 10,
      fontSize: 18,
  },
  toggleCreateRoomButton: {
      marginTop: 22,
      padding: 12,
      borderWidth: 2,
      backgroundColor: '#FDA50F',
  },
  toggleCreateRoomText: {
    fontSize: 25,
    textAlign: 'center',
  },
});

export default CreateRoom