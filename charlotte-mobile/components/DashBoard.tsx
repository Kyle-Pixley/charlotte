import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MenuList from './MenuList';
import ContentBox from './ContentBox';
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';


function DashBoard() {

  const [ menuList, setMenuList ] = useState(false);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value}]
    }
  })

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.mainView}>
        <View>
          <MenuList isOpen={menuList} />
          <Pressable 
            onPress={()=> setMenuList(!menuList)}
            onPressIn={() => {
              scale.value = withTiming(0.9, {duration: 100})
            }}
            onPressOut={() => {
              scale.value = withTiming(1, { duration: 100 })
            }}
            style={[styles.menu, styles.menuButton]}>
            <Animated.View style={[styles.menuButton, animatedStyle]}>
              <Text style={styles.text}>PP</Text>
            </Animated.View>

          </Pressable>
          <Text style={styles.header}>Charlotte</Text>
        </View>
        <View style={styles.content}>
          <ContentBox />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C0C0D8',
    height: '100%',
    width: '100%',
    padding: 6,
  },
  mainView: {
    padding: 0,
    margin: 0,
    height: '100%',
    width: '100%',
  },
  menu: {
    backgroundColor: '#FDA50F',
    height: 44,
    width: 44
  },
  menuButton: {
    position: 'absolute',
    top: 0, 
    left: 0,
    zIndex: 33,
  },
  button: {
    width: 44,
    height: 44,
    backgroundColor: "#FDA50F",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: 'relative',
    fontSize: 44,
    marginTop: -6,
    marginLeft: 55,
  },
  text: {
    color: '#023020',
    fontSize: 22,
  },
  content: {
    borderBlockColor: '#960018',
    position: 'absolute',
    top: 44,
    height: '90%',
    width: '100%',
  }
})

export default DashBoard;