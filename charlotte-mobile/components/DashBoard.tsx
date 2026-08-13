import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MenuList from './MenuList';
import ContentBox from './ContentBox';
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';


type DashBoardProps = {
  token: string;
  setToken: Dispatch<SetStateAction<string | null>>;
}

function DashBoard({token, setToken} : DashBoardProps) {

  const [ menuList, setMenuList ] = useState(false);
  const [ currentRoom, setCurrentRoom ] = useState<number>(0);

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
          <MenuList 
            isOpen={menuList} 
            token={token} 
            setToken={setToken} 
            currentRoom={currentRoom} 
            setCurrentRoom={setCurrentRoom}/>

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
              <Text style={styles.text}>{"\u2630"}</Text>
            </Animated.View>

          </Pressable>
          <Text style={styles.header}>Charlotte</Text>
        </View>
        <View style={styles.content}>
          <ContentBox />
        </View>
      </View>
      {/*//! ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++= */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#C0C0D8',
    flex: 1,
    padding: 6,
    alignSelf: 'stretch',
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
  },
  header: {
    position: 'relative',
    fontSize: 44,
    marginTop: -6,
    marginLeft: 55,
  },
  text: {
    color: '#023020',
    fontSize: 44,
    transform: [{ translateY: 3 }, {translateX: 2}],
  },
  content: {
    borderColor: '#960018',
    position: 'absolute',
    top: 44,
    height: '90%',
    width: '100%',
  }
})

export default DashBoard;