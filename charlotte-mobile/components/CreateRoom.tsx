import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BouncePressable from './BouncePressable';
import AppText from './AppText';

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function CreateRoom() {

    const navigation = useNavigation<NavigationProp>();

    const [ roomInfo, setRoomInfo ] = useState({
        name: '',
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