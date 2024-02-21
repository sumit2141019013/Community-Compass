import React, { useState } from "react";
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
  Alert
} from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
const { height } = Dimensions.get("window");

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [zipcode, setZipcode] = useState("");
  const navigation = useNavigation();
  
  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      zipcode:zipcode
    };

    axios
      .post("http://192.168.254.160:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "verification mail sent to your email"
        );
        setName("");
        setEmail("");
        setPassword("");
        setZipcode("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
        console.log("error", error);
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
            source={require("../assets/register.png")}
            style={styles.loginpic}
          />
          <Text style={styles.headcontent}>
            Register today for endless book adventures!
          </Text>

          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            fontSize={responsiveFontSize(2.3)}
            value={name}
            onChangeText={(text) => setName(text)}
          />
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
          <TextInput
            style={styles.input}
            placeholder="Zipcode"
            fontSize={responsiveFontSize(2.3)}
            value={zipcode}
            onChangeText={(text) => setZipcode(text)}
          />

          <Text style={styles.leftAlignedText}>
            successfully registered?
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.boldText}>Login Now</Text>
            </Text>
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
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
    marginBottom: height * 0.03,
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
    width: "100%",
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

export default Register;
