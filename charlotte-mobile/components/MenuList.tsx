import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import AppText from "./AppText";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GroupsList from "./GroupsList";

type MenuListProps = {
  isOpen: boolean;
  token: string;
  setToken: Dispatch<SetStateAction<string | null>>;
  currentRoom: number;
  setCurrentRoom: Dispatch<SetStateAction<number>>;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MenuList({
  isOpen,
  token,
  setToken,
  currentRoom,
  setCurrentRoom,
}: MenuListProps) {
  const navigation = useNavigation<NavigationProp>();

  const [groupsOpen, setGroupsOpen] = useState(false);

  const slideX = useSharedValue(-330);

  useEffect(() => {
    slideX.value = withTiming(isOpen ? 0 : -330, { duration: 250 });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideX.value }],
    };
  });

  return (
    <Animated.View style={[styles.menulist, animatedStyle]}>
      <Pressable onPress={() => navigation.navigate("CreateRoom", { token })}>
        <AppText>Create Room</AppText>
      </Pressable>

      <Pressable
        style={styles.menuItem}
        onPress={() => setGroupsOpen((prev) => !prev)}
      >
        <AppText>Groups</AppText>
      </Pressable>

      <GroupsList
        token={token}
        isOpen={groupsOpen}
        setCurrentRoom={setCurrentRoom}
      />

      <Pressable style={styles.logoutButton} onPress={() => setToken(null)}>
        <AppText>logout</AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  menulist: {
    position: "absolute",
    width: "75%",
    backgroundColor: "white",
    zIndex: 2,
    top: 44,
  },
  menuItem: {
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: "#960018",
    marginTop: 50,
  },
});

export default MenuList;