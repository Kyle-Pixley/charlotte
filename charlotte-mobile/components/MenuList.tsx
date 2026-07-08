import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import AppText from './AppText';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

type MenuListProps = { 
  isOpen: boolean;
    setToken: Dispatch<SetStateAction<string | null>>;
  };

function MenuList({isOpen, setToken} : MenuListProps) {

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
        <AppText>Menu List</AppText>
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