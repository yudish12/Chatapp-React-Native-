import { Pressable, StyleSheet, Text, View,Image } from 'react-native'
import React,{useEffect,useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../UserContext';

const UserChat = ({item}) => {
    const navigator = useNavigation();
    const {userId} = useUserContext();
    const [messages, setMessages] = useState([]);
    const [loading,setLoading] = useState(true);
    const fetchMessages = async()=>{
      try {
        const response = await fetch(
          `http://192.168.0.189:5000/messages/${userId}/${item._id}`
        );
        const data = await response.json();
  
        if (response.ok) {
          setMessages(data);
        } else {
          console.log("error showing messags", response.status.message);
        }
        console.log(data,62);
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

    const getLastMessage = () => {
      const userMessages = messages.filter(
        (message) => message.messageType === "text"
      );
  
      const n = userMessages.length;
  
      return userMessages[n - 1];
    };

    const lastMessage = getLastMessage();
    console.log(lastMessage);
    const formatTime = (time) => {
      const options = { hour: "numeric", minute: "numeric" };
      return new Date(time).toLocaleString("en-US", options);
    };

    console.log()

  return (
    <Pressable style={styles.container} 
        onPress={()=>navigator.navigate("Messages",{
            recepientId:item._id
        })}
    >
      <Image style={styles.image} source={{uri:item?.image}} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item?.username}</Text>
        {lastMessage && (
          <Text style={{ marginTop: 3, color: "gray", fontWeight: "500" }}>
            {lastMessage?.message}
          </Text>
        )}
      </View>
      <View style={{}} >
      <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          {lastMessage && formatTime(lastMessage?.timeStamp)}
        </Text>
      </View>
    </Pressable>
  )
}

export default UserChat

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:"center",
        gap:10,
        borderWidth:0.9,
        borderColor:"#DODODO",
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        padding:10
    },  
    image:{
        width:50,
        height:50,
        borderRadius:25,
        resizeMode:"cover"
    },
    nameText:{
        fontSize:15,
        fontWeight:"500"
    },
    messageText:{
        marginTop:5,
        color:"gray",
        fontWeight:"500"
    }
})