import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import EmojiSelector from "react-native-emoji-selector";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUserContext } from "../UserContext";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import socketServcies from "./socketService";

const ChatMessage = () => {
  const navigate = useNavigation();
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const ScrollViewRef = useRef(null)
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector);
  };
  const height = useHeaderHeight();
  const route = useRoute();
  const [selectedMessages, setSelectedMessages] = useState([123]);
  const { recepientId } = route.params;
  const { userId } = useUserContext();

  const [imagePermission, setImagePermission] = useState(null);
  const [id,setId] = useState('');

  useEffect(()=>{
    const getId = async()=>{
    const resp = await axios.get(`http://192.168.0.189:5000/me/${userId}`);
    setId(resp.data.userInfo._id) 
    }
    getId()
  },[])

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setImagePermission(galleryStatus.status === "granted");
    })();
  }, []);


  const fetchMessages = async()=>{
    try {
      const response = await fetch(
        `http://192.168.0.189:5000/messages/${userId}/${recepientId}`
      );
      const data = await response.json();
        console.log(data,82)
      if (response.ok) {
        setMessages(data);
      } else {
        console.log("error showing messags", response.status.message);
      }
      setLoading(false)
    } catch (error) {
      console.log("error fetching messages", error);
      setLoading(false)
    }
  }

  useEffect(() => {
    
    setLoading(true);
    fetchMessages();
  }, []);

  useEffect(()=>{
    scrollToBottom()
  },[])

  const scrollToBottom = ()=>{
    if(ScrollViewRef.current){
      ScrollViewRef.current.scrollToEnd({animated:false})
    }
  }

  useEffect(() => {
    setLoading(true);
    const getUserInfo = async () => {
      try {
        const resp = await axios.get(`http://192.168.0.189:5000/user/${recepientId}`);
        setUserInfo(resp.data.userInfo);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getUserInfo();
  }, []);


  useEffect(()=>{
    socketServcies.initializeSocket();
  },[])


  const handleSend = async (messageType, image) => {
    try {
      const formData = new FormData();
      formData.append("token", userId);
      formData.append("recepientId", recepientId);
      //check message type
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("image", {
          uri: image.uri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }
      const response = await axios.post("http://192.168.0.189:5000/message", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      socketServcies.emit('message',response.data)
      setMessage("");
      setSelectedImage("");
      fetchMessages()
    } catch (error) {
      console.log(error,89)
      Alert.alert(error.response.data.message);
    }
  };


  useEffect(()=>{
    console.log("asd")
    socketServcies.on('message recieved',(msg)=>{
      fetchMessages()
    })
  })


  useLayoutEffect(() => {
    navigate.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons onPress={()=>navigate.goBack()} name="arrow-back" size={24} color={"black"} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: userInfo?.image }}
              />
            
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {userInfo?.username}
              </Text>
            </View>
        </View>
      ),
    });
  }, [loading]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      handleSend("image",result.assets[0])
    }
  };

  if (loading) return <ActivityIndicator />;

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  

  const handleContentSizeChange = ()=>{
    scrollToBottom()
  }

  

  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F0F0F0" }}
      keyboardVerticalOffset={height - 25}
      behavior="padding"
      enabled
    >
      <ScrollView ref={ScrollViewRef} contentContainerStyle={{flexGrow:1}} onContentSizeChange={handleContentSizeChange} >
        {messages.length?messages.map((item,index)=>{
          if(item.messageType==="text"){
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId._id === id?{
                    alignSelf:"flex-end",
                    backgroundColor:"#DCF8C6",
                    padding:8,
                    maxWidth:"60%",
                    borderRadius:7,
                    margin:7
                  }: {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}
              >
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: item.senderId._id===id?"left":"right",
                    paddingRight:40,
                  }}
                >
                  {item?.message}
                </Text>
                <Text
                    style={[
                      item.senderId._id===id?
                      {
                      textAlign: item.senderId._id===id?"left":"right",
                      fontSize: 8,
                      position: "absolute",
                      right:7,
                      bottom: 2,
                      color: "black",
                      marginTop: 5,
                    }:{
                        
                      textAlign:"left",
                      fontSize: 8,
                      position: "absolute",
                      right:7,
                      bottom: 2,
                      color: "black",
                      marginTop: 5,
                    }
                    ]}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
              </Pressable>
            )
          }
          
          if (item.messageType === "image") {
            const imageUrl = item.imageUrl;
            return (
              <Pressable
                key={index}
                style={[
                  item?.senderId?._id === id
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#DCF8C6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                      },
                ]}
              >
                <View>
                  <Image
                    source={{uri:item?.imageUrl}}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      right: 10,
                      bottom: 7,
                      color: "white",
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item?.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }

        }):<></>}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 25,
        }}
      >
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 5 }}
          name="emoji-happy"
          size={24}
          color={"black"}
        />
        <TextInput
          placeholder="Type Your Message"
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <Entypo name="camera" onPress={() => pickImage()} size={24} color={"gray"} />
          <Feather name="mic" size={24} color={"gray"} />
        </View>
        <Pressable
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
          onPress={()=>handleSend("text")}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({});
