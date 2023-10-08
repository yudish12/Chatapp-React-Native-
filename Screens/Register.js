import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const Login = () => {
  const navigator = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [images, setImages] = useState(null);

  const [imagePermission, setImagePermission] = useState(null);

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setImagePermission(galleryStatus.status === "granted");
    })();
  }, []);

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("username", name);
    form.append("email", email);
    form.append("password", password);
    form.append("image", {
      uri: images.uri,
      type: "image/jpg",
      name: "image.jpg",
    });
    form.append("imageDest",images.uri)
    try {
      const response = await fetch("http://192.168.0.189:5000/register",{
        method:'POST',
        body:form,
        headers:{
          'content-type':'multipart/form-data'
        }
      });
      const res = await response.json();
      navigator.navigate("Home")
    } catch (error) {
      console.log(error, 123);
    }
    
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      console.log(result.assets[0]);
      setImages(result.assets[0]);
    }
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.Header}>Register</Text>
        <Text style={styles.subHeader}>Create a new Account</Text>
        <View style={styles.inputContainer}>
          <View style={{ width: "100%", marginTop: 20 }}>
            <Text style={styles.subHeader}>Username</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              onChangeText={(text) => setName(text)}
              defaultValue={name}
              placeholder="Enter Your Name"
              keyboardType="default"
            />
          </View>
          <View style={{ width: "100%", marginTop: 30 }}>
            <Text style={styles.subHeader}>Email</Text>
            <TextInput
              placeholderTextColor={"black"}
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              defaultValue={email}
              placeholder="Enter Your Email"
              keyboardType="email-address"
            />
          </View>
          <View style={{ width: "100%", marginTop: 30 }}>
            <Text style={styles.subHeader}>Password</Text>
            <TextInput
              placeholderTextColor={"black"}
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              defaultValue={password}
              secureTextEntry={true}
              placeholder="Enter Your Password"
              keyboardType="default"
            />
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              marginTop: 30,
            }}
          >
            <Button title="Add Image" onPress={() => pickImage()}></Button>
            {images ? (
              <Image
                source={{ uri: images.uri }}
                style={{ flex: 1 / 3, width: 70, height: 70, borderRadius: 50 }}
              />
            ) : (
              <></>
            )}
          </View>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigator.navigate("Login")}
            style={styles.link}
          >
            <Text style={styles.linkText}>Already Have An Account?Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
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
    alignItems: "center",
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
  button: {
    marginTop: 40,
    borderRadius: 8,
    width: "55%",
    padding: 15,
    backgroundColor: "#4267B2",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
  link: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  linkText: {
    color: "#B4B4B3",
    fontSize: 15,
    fontWeight: "700",
  },
});
