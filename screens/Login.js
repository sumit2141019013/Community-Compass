import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
const { height } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Login = () => { 
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigation = useNavigation();
useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        setTimeout(() => {
          navigation.replace("Home");
        }, 400);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  checkLoginStatus();
}, []);
const handleLogin = () => {
  const user = {
    email: email,
    password: password,
  };

  axios
    .post("http://192.168.254.160:3000/login", user)
    .then((response) => {
      console.log(response);
      const token = response.data.token;
      AsyncStorage.setItem("authToken", token);
      navigation.navigate("Home");
    })
    .catch((error) => {
      Alert.alert("Login error", error.response?.data?.message || "Unknown error");
      console.error("error ", error);
    });
};
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 30}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={require("../assets/login.png")}
            style={styles.loginpic}
          />
          <Text style={styles.headcontent}>
            Unlock worlds with words: Your literary journey begins here.
          </Text>

          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            fontSize={responsiveFontSize(2.3)}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            fontSize={responsiveFontSize(2.3)}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <Text style={styles.leftAlignedText}>
            Yet not registered?
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Register")}
            >
              <Text style={styles.boldText}> Register</Text>
            </Text>
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginpic: {
    width: "100%",
    height: height * 0.3,
  },
  headcontent: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: responsiveFontSize(3),
    marginBottom: height * 0.05,
    color: "navy",
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: "500",
    marginBottom: height * 0.03,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: height * 0.02,
    paddingHorizontal: 10,
    width: "95%",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  registerLink: {
    textAlign: "left",
    color: "green",
  },
  leftAlignedText: {
    color: "black",
  },

  boldText: {
    fontWeight: "bold",
    fontSize: responsiveFontSize(2),
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  button: {
    backgroundColor: "#0096FF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: height * 0.01,
    width: "50%",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  buttonText: {
    color: "white",
    fontSize: responsiveFontSize(2.5),
    fontWeight: "400",
  },
});

export default Login;
