import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import AppText from './AppText';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MenuListProps = { 
  isOpen: boolean;
  token: string;
  setToken: Dispatch<SetStateAction<string | null>>;
  currentRoom: number;
  setCurrentRoom: React.Dispatch<React.SetStateAction<number>>;
  };

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


function MenuList({isOpen, token, setToken, currentRoom, setCurrentRoom} : MenuListProps) {

  const navigation = useNavigation<NavigationProp>();

  type Group = {
    id: number;
    name: string | null;
    admin_id: number;
  }

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    async function getGroups() {
      try{
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/get_user_groups/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          console.log("error getting groups:", data);
          return;
        }

        setGroups(data.groups);

      } catch(error) {
        console.log("Fetch groups error:", error);
      }
    }
    if (token) {
      getGroups();
    }
  }, [token]);

  const slideX = useSharedValue(-330);

  useEffect(() => {
    slideX.value = withTiming(isOpen ? 0 : -330, {duration: 250});
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value }],
    }
  });



  return (
    <Animated.View style={[styles.menulist, animatedStyle]}>
        <Pressable onPress={() => navigation.navigate("CreateRoom" , { token })}>
          <AppText>Create Room</AppText>
        </Pressable>
        <Pressable>
        </Pressable>
        
        {groups.map((group) => (
          <Pressable 
            key={group.id} 
            onPress={() => setCurrentRoom(group.id)}>
            <AppText>{group.name ?? ` Group${group.id}`}</AppText>    
          </Pressable>
        ))}

        <Pressable 
            style={styles.logoutButton}
            onPress={() => setToken(null)}>
            <AppText>logout</AppText>
          </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  menulist: {
      position: 'absolute',
      width: '75%',
      backgroundColor: 'white',
      zIndex: 2,
      top: 44,
  },
  logoutButton: {
    backgroundColor: '#960018',
    marginTop: 50,
  }
})

export default MenuList;