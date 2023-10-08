import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useUserContext } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileModal = ({ showModal, setShowModal }) => {
  const { setUserId } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [userInfo,setUserInfo] = useState(null);
  const navigator = useNavigation();
  useEffect(() => { 
      const getUserInfo = async () => {
        const userId = await AsyncStorage.getItem('authToken');
        console.log(userId,90)
        try {
            const resp = await axios.get(`http://192.168.0.189:5000/me/${userId}`);
            setUserInfo(resp.data.userInfo)
            setLoading(false)   
            console.log(resp.data.userInfo.image)
        } catch (error) {
            console.log(error);
        }
    };
    getUserInfo();
  }, []);
  //   console.log(userInfo);

  const logout = async()=>{
    await AsyncStorage.clear();
    setUserId(null)
    setShowModal(false)
    navigator.replace("Login");
  }

  return (
    <Modal
      presentationStyle="pageSheet"
      visible={showModal}
      transparent={true}
      onRequestClose={() => setShowModal(false)}
      animationType="slide"
    >
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            paddingHorizontal: 10,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            paddingVertical: 10,
            marginBottom: 5,
            alignItems: "center",
            height: 400,
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
            {userInfo.image?<Image
                style={styles.logo}
                source={{ uri: userInfo.image }}
                resizeMode="contain"
              />:<ActivityIndicator/>}
              
              <View style={styles.infoContainer}>
                <Text style={styles.Header}>Hey {userInfo?.username}</Text>
                <Text style={styles.subHeader} >Wanna Logout?? Press the button below</Text>
                <TouchableOpacity style={styles.button} onPress={logout} ><Text style={styles.buttonText} >Logout</Text></TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    paddingTop: 370,
    paddingHorizontal: 0,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  infoContainer: {
    marginTop: 20,
    flex: 1,
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
  },
  Header: {
    fontSize: 25,
    fontWeight: "600",
    color: " #4267B2",
  },
  subHeader: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "500",
    color: "#B4B4B3",
  },
  button:{
    marginTop:40,
    borderRadius:8,
    width:"55%",
    padding:15,
    paddingHorizontal:25,
    backgroundColor:"#4267B2",
    alignItems:"center"
  },
  buttonText:{
    fontSize:15,
    fontWeight:"500",
    color:"white"
  },
});
