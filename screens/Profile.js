import React, { useContext, useState, useEffect } from "react";
import { View, Text,  StyleSheet ,Pressable} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { UserType } from "../UserContext";
import { responsiveFontSize } from "react-native-responsive-dimensions";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();
  const { setUserId } = useContext(UserType);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userDetails");
      setUserId(null);

      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleGetUserInfo = async () => {
    const token = await AsyncStorage.getItem("authToken");

    try {
      const response = await axios.post("http://192.168.254.160:3000/user-info", { token });
      setUserInfo(response.data.user);
    } catch (error) {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  const handleUpdateNavigation = () => {
    navigation.navigate("Update");
  };

  const handleMyPostsNavigation = () => {
    navigation.navigate("Myposts");
  };
  // Use useFocusEffect to fetch user information when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      handleGetUserInfo();
    }, [])
  );

  return (
    <View style={styles.container}>

<Pressable style={styles.myPostsButton} onPress={handleMyPostsNavigation}>
        <Text style={styles.buttonText}>My Posts</Text>

      </Pressable>


      <Text style={styles.welcomeText}>Welcome to ProfileScreen!</Text>

      <View style={styles.cardContainer}>
        {userInfo && (
          <View>
            <Text style={styles.cardTitle}>User Information</Text>
            <Text style={styles.cardText}>Name: {userInfo.name}</Text>
            <Text style={styles.cardText}>Email: {userInfo.email}</Text>
            <Text style={styles.cardText}>Zipcode: {userInfo.zipcode}</Text>
            <Text style={styles.cardText}>Contact Number: {userInfo.callingNumber}</Text>
            <Text style={styles.cardText}>Adress: {userInfo.address}</Text>
          </View>
        )}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>

    <Pressable style={styles.updateButton} onPress={handleUpdateNavigation}>
        <Text style={styles.buttonText}>Update Details</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: "bold",
    color: "blue",
    marginBottom: 40,
  },
  cardContainer: {
    backgroundColor: "#D6EAF8",
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "90%",
  },
  cardTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  cardText: {
    fontSize: responsiveFontSize(2),
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#009688",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 19,
  },
  myPostsButton:{
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    position: "absolute",
    top: 40,
    right: 20,  }
});

export default Profile;
