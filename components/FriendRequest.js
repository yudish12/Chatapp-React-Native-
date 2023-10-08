import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from "../UserContext";

const FriendRequest = ({
  item,
  friendRequests,
  setFriendRequests,
  isFriend,
}) => {
  const { userId, setUserId } = useUserContext();
  const navigation = useNavigation();
  const acceptRequest = async (friendRequestId) => {
    if (isFriend) return;
    try {
      console.log(userId);
      const response = await fetch(
        "http://192.168.0.189:5000/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            token: userId,
          }),
        }
      );

      if (response.ok) {
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (err) {
      console.log("error acceptin the friend request", err);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />
      {!isFriend ? (
        <Text
          style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
        >
          {item?.name} sent you a friend request!!
        </Text>
      ) : (
        <Text
          style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
        >
          {item?.name} is your friend
        </Text>
      )}

      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{
          backgroundColor: !isFriend ? "#0066b2" : "green",
          padding: 10,
          borderRadius: 6,
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          {!isFriend ? "Accept" : "Friends"}
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
