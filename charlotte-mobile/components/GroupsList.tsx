import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AppText from "./AppText";

type Group = {
  id: number;
  name: string | null;
  admin_id: number;
};

type GroupsListProps = {
  token: string;
  isOpen: boolean;
  setCurrentRoom: Dispatch<SetStateAction<number>>;
};

function GroupsList({ token, isOpen, setCurrentRoom }: GroupsListProps) {
  const [groups, setGroups] = useState<Group[]>([]);

  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    height.value = withTiming(isOpen ? 200 : 0, { duration: 250 });
    opacity.value = withTiming(isOpen ? 1 : 0, { duration: 250 });
  }, [isOpen]);

  useEffect(() => {
    async function getGroups() {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/get_user_groups/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.log("error getting groups:", data);
          return;
        }

        setGroups(data.groups);
      } catch (error) {
        console.log("Fetch groups error:", error);
      }
    }

    if (token) {
      getGroups();
    }
  }, [token]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      opacity: opacity.value,
      overflow: "hidden",
    };
  });

  return (
    <Animated.View style={[styles.groupsContainer, animatedStyle]}>
      {groups.length > 0 ? (
        groups.map((group) => (
          <Pressable
            key={group.id}
            style={styles.groupButton}
            onPress={() => setCurrentRoom(group.id)}
          >
            <AppText>{group.name ?? `Group ${group.id}`}</AppText>
          </Pressable>
        ))
      ) : (
        <AppText>No groups yet</AppText>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  groupsContainer: {
    paddingLeft: 16,
    backgroundColor: "#eeeeee",
  },
  groupButton: {
    paddingVertical: 8,
  },
});

export default GroupsList;