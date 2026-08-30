import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppText from "./AppText";

type ContentBoxProps = {
  token: string;
  currentRoom: number;
  currentUserId: number;
};

type Message = {
  id: number;
  sender_id: number;
  sender_name: string;
  body: string;
  is_system_message: boolean;
  timestamp: string;
};

function ContentBox({ token, currentRoom, currentUserId }: ContentBoxProps) {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [roomName, setRoomName] = useState<string | null>(null);

  useEffect(() => {
    async function getRoomMessages() {
      if (currentRoom === 0) {
        setConversation([]);
        setRoomName(null);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/get_room_messages/${currentRoom}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.log("Error getting room messages:", data);
          return;
        }

        setRoomName(data.room.name);
        setConversation(data.messages);
      } catch (error) {
        console.log("Fetch room messages error:", error);
      }
    }

    if (token) {
      getRoomMessages();
    }
  }, [token, currentRoom]);

  return (
    <View style={styles.mainView}>
      {currentRoom === 0 ? (
        <View style={styles.emptyBox}>
          <AppText>Select a group</AppText>
        </View>
      ) : (
        <>
          <View style={styles.roomHeader}>
            <AppText>{roomName ?? `Room ${currentRoom}`}</AppText>
          </View>

          <ScrollView style={styles.messagesBox}>
            {conversation.length > 0 ? (
              conversation.map((message) => { 

                const isUserMessage = message.sender_id === currentUserId;

                return (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.is_system_message && styles.systemMessage,
                    isUserMessage && styles.userMessage
                  ]}
                >
                  {!message.is_system_message && (
                    <AppText style={[styles.messageSender]}>{message.sender_name}</AppText>
                  )}

                  <AppText style={styles.messageBody}>{message.body}</AppText>
                </View>
              )})
            ) : (
              <AppText>No Messages</AppText>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    borderWidth: 2,
    borderColor: "#960018",
    height: "100%",
    width: "100%",
  },
  emptyBox: {
    padding: 12,
  },
  roomHeader: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#960018",
    backgroundColor: "white",
  },
  messagesBox: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#960018",
    padding: 8,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 22,
    marginBottom: 22,
    color: "#960018",
    fontWeight: "600",
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageBody: {
    fontSize: 22
  },
  systemMessage: {
    backgroundColor: "#eeeeee",
  },
});

export default ContentBox;