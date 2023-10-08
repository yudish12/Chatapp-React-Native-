import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserContext } from '../UserContext';
import UserChat from '../components/UserChat';


const Chats = () => {
    const {userId} = useUserContext();
    const [acceptedFriends,setAcceptedFriends] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        const acceptedFriendsList = async () => {
          try {
            const response = await fetch(
              `http://192.168.0.189:5000/chatlist/${userId}`
            );
            const data = await response.json();
                console.log(data)
            if (response.ok) {
              setAcceptedFriends(data);
            }
            setLoading(false);
          } catch (error) {
            Alert.alert("error showing the accepted friends", error);
            setLoading(false);
          }
        };
    
        acceptedFriendsList();
      }, []);


      if(loading)return (
        <View style={{marginTop:12}} >
        <ActivityIndicator/>
      </View>
)

if(acceptedFriends.length>0){
    return (
        <ScrollView>
            <Pressable>
                {acceptedFriends.map((item,index)=>(
                    <UserChat key={index} item={item}/>
                ))}
            </Pressable>
        </ScrollView>
      )
}

  
}

export default Chats

const styles = StyleSheet.create({})