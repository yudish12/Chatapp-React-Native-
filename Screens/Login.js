import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useUserContext } from "../UserContext";

const Login = () => {
    const navigate = useNavigation();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const {setUserId,setUserInfo} = useUserContext();
    useEffect(()=>{
      const checkLoginStatus = async ()=>{
        try {
          const token = await AsyncStorage.getItem('authToken')
          console.log(token,123)
          if(token){
              setUserId(token);
              navigate.replace("Home");
          }else{
          }
        } catch (error) {
          console.log("error",error);
        }
          
      }
      checkLoginStatus();
  },[])

  const handleSubmit = async()=>{
    try {
      const data = await axios.post("http://192.168.0.189:5000/login",{email:email,password:password},{
      headers:{
        'Content-Type':'application/json'
      }
    })
    await AsyncStorage.setItem('authToken',data.data.token);
    setUserId(data.data.token);
    navigate.replace("Home")
  } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }

  }

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true} >
    <SafeAreaView style={styles.container}>
      <Text style={styles.Header}>Sign In</Text>
      <Text style={styles.subHeader}>Sign In to Your Account</Text>
      <View style={styles.inputContainer}>
        <View style={{ width: "100%",marginTop:20 }}>
          <Text style={styles.subHeader}>Email</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={"black"}
            onChangeText={text=>setEmail(text)}
            defaultValue={email}
            placeholder="Enter Your Email"
            keyboardType="email-address"
          />
        </View>
        <View style={{ width: "100%",marginTop:30 }} >
          <Text style={styles.subHeader}>Password</Text>
          <TextInput
            placeholderTextColor={"black"}
            style={styles.input}
            onChangeText={text=>setPassword(text)}
            defaultValue={password}
            secureTextEntry={true}
            placeholder="Enter Your Password"
            keyboardType="default"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit} ><Text style={styles.buttonText} >Login</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>navigate.navigate("Register")} style={styles.link} ><Text style={styles.linkText} >Don't Have An Account?Sign Up</Text></TouchableOpacity>
      </View>
      
    </SafeAreaView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    alignItems: "center",
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
  inputContainer: {
    // borderWidth:2,
    // borderColor:"red",
    alignItems:"center",
    width: "100%",
    padding: 40,
    flex: 1,
  },
  input: {
    paddingVertical: 10,
    marginTop: 5,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  button:{
    marginTop:40,
    borderRadius:8,
    width:"55%",
    padding:15,
    backgroundColor:"#4267B2",
    alignItems:"center"
  },
  buttonText:{
    fontSize:15,
    fontWeight:"500",
    color:"white"
  },
  link:{
    marginTop:20,
    width:"100%",
    alignItems:"center"
  },
  linkText:{
    color: "#B4B4B3",
    fontSize:15,
    fontWeight:"700"
  }
});
