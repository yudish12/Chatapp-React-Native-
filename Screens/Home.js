import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useUserContext } from '../UserContext';
import axios from 'axios';
import User from '../components/User';
import ProfileModal from '../components/ProfileModal';

const Home = () => {
    const navigate = useNavigation();
    const [loading,setLoading] = useState(true);
    const {userId} = useUserContext();
    const [allUsers,setAllUsers] = useState(null);
    const [showModal,setShowModal] = useState(false);

    useLayoutEffect(()=>{
        navigate.setOptions({
            headerTitle:"",
            headerLeft:()=>(
                <Text style={{fontSize:16,fontWeight:"bold"}} >Messenger Chat</Text>
            ),
            headerRight:()=>(<View style={{flexDirection:"row",gap:10,alignItems:"center"}} >
                <Ionicons onPress={()=>navigate.navigate("Chats")} name='chatbox-ellipses-outline' size={24} color={"black"} />
                <MaterialIcons onPress={()=>navigate.navigate("Friends")} name='people-outline' size={24} color={"black"} />
                <MaterialIcons onPress={()=>setShowModal(true)} name='logout' size={24} color={"black"} />
            </View>)
        })
    },[])

    useEffect(()=>{ 
        const getUserInfo = async ()=>{
            setLoading(true);
            try {
                const resp = await axios.get(`http://192.168.0.189:5000/users/${userId}`)
                setAllUsers(resp.data.data);   
                console.log(resp.data,900)
                setLoading(false);
                 
            } catch (error) {
                console.log("error",error);
                setLoading(false);
            }finally{ 
                setLoading(false);
            }
        }
        getUserInfo();
    },[])

if(loading)return <ActivityIndicator/>

  return (
    <View>
    <View style={{padding:10}}>
      {allUsers?.map((e)=><User {...e} key={e._id} />)}  
      </View>
    <ProfileModal setShowModal={setShowModal} showModal={showModal} />
    </View>

  )
}

export default Home

const styles = StyleSheet.create({})