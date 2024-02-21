import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import axios from "axios";

const Update = () => {
  const [updatedName, setUpdatedName] = useState("");
  const [updatedZipcode, setUpdatedZipcode] = useState("");
  const [updatedCallingNumber, setUpdatedCallingNumber] = useState("");
  const [updatedAddress, setUpdatedAddress] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Declare userInfo state
  const navigation = useNavigation();

  const handleGetUserInfo = async () => {
    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "http://192.168.254.160:3000/user-info",
        { token }
      );
      setUserInfo(response.data.user);
    } catch (error) {
      setUserInfo(null);
    }
  };

  const updateUserDetails = async () => {
    try {
      if (userInfo && userInfo.email) {
        const payload = {
          email: userInfo.email,
        };
  
        if (updatedName) {
          payload.name = updatedName;
        }
  
        if (updatedZipcode) {
          payload.zipcode = updatedZipcode;
        }
  
        if (updatedCallingNumber) {
          payload.callingNumber = updatedCallingNumber;
        }
  
        if (updatedAddress) {
          payload.address = updatedAddress;
        }
  
        const response = await axios.post(
          "http://192.168.254.160:3000/update",
          payload
        );
  
        await handleGetUserInfo();
        navigation.navigate("Profile");
  
        // Show success alert
        Alert.alert("Success", "User details updated successfully");
      } else {
        console.log(
          "User information or email not available for updating user details"
        );
  
        // Show failure alert
        Alert.alert("Error", "User details update failed");
      }
    } catch (error) {
      console.log("Error updating user details", error);
  
      // Show failure alert
      Alert.alert("Error", "User details update failed");
    }
  };
  

 

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new name"
        value={updatedName}
        onChangeText={(text) => setUpdatedName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter new zipcode"
        value={updatedZipcode}
        onChangeText={(text) => setUpdatedZipcode(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter new callingNumber"
        value={updatedCallingNumber}
        onChangeText={(text) => setUpdatedCallingNumber(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter new address"
        value={updatedAddress}
        onChangeText={(text) => setUpdatedAddress(text)}
      />
      <TouchableOpacity style={styles.updateButton} onPress={updateUserDetails}>
        <Text style={styles.buttonText}>Update Details</Text>
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Update;
