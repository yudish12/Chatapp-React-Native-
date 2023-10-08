import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, useLayoutEffect} from "react";
import axios from "axios";
import {  useUserContext } from "../UserContext";
import FriendRequest from "../components/FriendRequest";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const FriendsScreen = () => {
  const navigate = useNavigation();
  const { userId, setUserId } = useUserContext()
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends,setFriends] = useState([]);
  const [loading,setLoading] = useState(true);

  useLayoutEffect(()=>{
    navigate.setOptions({
        headerTitle:"Friend Requests",
    })
},[])

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.189:5000/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestsData = response.data.requests.freindRequests.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.username,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
        const friendsData = response.data.requests.friends.map((e)=>({
          _id:e._id,
          name:e.username,
          email:e.email,
          image:e.image
        }))
        setFriendRequests(friendRequestsData);
        setFriends(friendsData);
        setLoading(false);
      }
    } catch (err) {
      console.log("error message", err);
      setLoading(false);
    }
  };

  if(loading)return <ActivityIndicator/>
  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 && <Text>Your Friend Requests!</Text>}

      {friendRequests.map((item, index) => (
        <FriendRequest
          key={index}
          item={item}
          isFriend={false}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      ))}
      {console.log(friends,987)}
      {friends.map((item, index) => 
      { 
        console.log(item,72);
        return (
        <FriendRequest
          key={index}
          item={item}
          isFriend={true}
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      )})}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});