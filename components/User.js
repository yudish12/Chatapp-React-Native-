import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const User = ({ _id, username, email, image, imagedest }) => {
  const addFriend = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const resp = await axios.post('http://192.168.0.189:5000/friend-request',{currentUserId:token,selectedUserId:_id},{
        headers:{
          'Content-Type':'application/json'
        }
      });
    } catch (error) {
      Alert.alert(error.response.data.message)
    }
  };

  return (
    <Pressable
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: image }} // Assuming 'image' contains the filename with extension
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ marginTop: 4, fontWeight: "bold" }}> {username} </Text>
        <Text style={{ marginTop: 4, color: "gray" }}> {email} </Text>
      </View>
      <Pressable
        onPress={addFriend}
        style={{
          backgroundColor: "#567189",
          padding: 10,
          borderRadius: 6,
          width: 105,
        }}
      >
        <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
          Add Friend
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});


