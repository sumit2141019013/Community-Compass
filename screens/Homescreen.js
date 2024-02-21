
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
  Modal,
  Button,
  Image,
} from "react-native";
import axios from "axios";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";



const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [pincode, setPincode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigation = useNavigation();

  const handleFetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userInfoResponse = await axios.post('http://192.168.254.160:3000/user-info', { token });
      const userPincode = userInfoResponse.data.user.zipcode;
  
      const response = await axios.get(`http://192.168.254.160:3000/getpost/${userPincode}`);
  
      let filteredPosts = response.data.posts;
  
      if (minPrice !== "" && maxPrice !== "") {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.rentFare >= parseFloat(minPrice) &&
            post.rentFare <= parseFloat(maxPrice)
        );
      }
  
      filteredPosts = filteredPosts.sort((a, b) => {
        const rentA = a.rentFare;
        const rentB = b.rentFare;
  
        if (sortOrder === "asc") {
          return rentA - rentB;
        } else {
          return rentB - rentA;
        }
      });
  
      setPosts(filteredPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  

  useFocusEffect(
    React.useCallback(() => {
      handleFetchPosts();
    }, [userInfo, minPrice, maxPrice, pincode, sortOrder])
  );

  const navigateToPostScreen = () => {
    navigation.navigate("Postscreen");
  };

  const makePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
            const cleanedNumber = phoneNumber.replace(/\D/g, '');
            const phoneNumberWithoutTel = cleanedNumber.startsWith('tel:') ? cleanedNumber.slice(4) : cleanedNumber;
      
            Linking.openURL(`tel:${phoneNumberWithoutTel}`).catch((error) => {
              console.error('Phone call error:', error);
            });
          } else {
            console.error('Invalid phone number');
          }
          };

  const openFilterModal = () => {
    setModalVisible(true);
  };

  const applyFilter = () => {
    setModalVisible(false);
    handleFetchPosts();
  };

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Your Nearby Rents</Text>

      <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Set Price Range</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Min Price"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={(text) => setMinPrice(text)}
            />
            <Text style={styles.modalPriceSeparator}>-</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Max Price"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={(text) => setMaxPrice(text)}
            />

            

            <Button title="Apply Filter" onPress={applyFilter} />

            <TouchableOpacity
              style={styles.sortButton}
              onPress={toggleSortOrder}
            >
              <Text style={styles.sortButtonText}>
                {sortOrder === "asc" ? "Sort Low to High" : "Sort High to Low"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>Name: {item.name}</Text>
            <Text style={styles.cardText}>Room Size: {item.roomSize}</Text>
            <Text style={styles.cardText}>Rent Fare: {item.rentFare}</Text>
            <Text style={styles.cardText}>Description: {item.description}</Text>
            <Text style={styles.cardText}>Address: {item.address}</Text>
            <Text style={styles.cardText}>Pincode: {item.pincode}</Text>
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />}
       
            <TouchableOpacity onPress={() => makePhoneCall(item.callingNumber)}>
              <View style={styles.phoneContainer}>
                <FontAwesome name="phone" size={25} color="green" />
                <Text style={styles.callText}>Call Me</Text>
                
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.plusIcon} onPress={navigateToPostScreen}>
        <FontAwesome name="plus" size={25} color="navy" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 70,
  },
  heading: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    marginBottom: 25,
    paddingTop: 40,
    textAlign: "left",
  },
  card: {
    backgroundColor: "#ABEBC6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  cardText: {
    fontSize: responsiveFontSize(2.2),
    marginBottom: 5,
  },
  filterButton: {
    backgroundColor: "#3498db",
    borderRadius: 5,
    padding: 4,
    alignItems: "center",
    marginBottom: 10,
  },
  filterButtonText: {
    color: "white",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    height: 35,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalPriceSeparator: {
    fontSize: 1,
    marginHorizontal: 5,
  },
  sortButton: {
    backgroundColor: "#3498db",
    borderRadius: 3,
    padding: 6,
    alignItems: "center",
    marginVertical: 10,
  },
  sortButtonText: {
    color: "white",
    fontSize: 17,
  },
  plusIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#3498db",
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  callText: {
    marginLeft: 5,
    fontSize: 15,
    color: "green",
  },
  cardImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
      },
});

export default HomeScreen;
