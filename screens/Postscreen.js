import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Postscreen = () => {
  const [UserInfo, setUserInfo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [callingNumber, setCallingNumber] = useState('');
  const [zipcode, setzipcode] = useState('');
  const [rentFare, setRentFare] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  const handleAddPost = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      const userInfoResponse = await axios.post("http://192.168.254.160:3000/user-info", { token });
      setUserInfo(userInfoResponse.data.user);

      const response = await axios.post('http://192.168.254.160:3000/addpost', {
        name,
        email: userInfoResponse.data.user.email, 
        callingNumber,
        pincode: zipcode, 
        rentFare,
        roomSize,
        address,
        description,
      });

      setName('');
      setCallingNumber('');
      setzipcode(''); 
      setRentFare('');
      setRoomSize('');
      setAddress('');
      setDescription('');

      if (response.data.user && response.data.user.email !== userInfoResponse.data.user.email) {
        Alert.alert('Invalid email');
      } else {
        Alert.alert('Success', 'Post added successfully');
        navigation.navigate('Homescreen');
      }
    } catch (error) {
      console.error('Error adding post:', error);
      Alert.alert('Error', 'Failed to add post. Please try again.');
    }
  };

  useEffect(() => {
    const fetchLoggedInUserEmail = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userInfoResponse = await axios.post("http://192.168.254.160:3000/user-info", { token });
        setEmail(userInfoResponse.data.user.email);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchLoggedInUserEmail(); 

  }, []); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Post</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false} // Make the input uneditable
      />

      <TextInput
        style={styles.input}
        placeholder="Calling Number"
        value={callingNumber}
        onChangeText={(text) => setCallingNumber(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Rent Fare"
        value={rentFare}
        onChangeText={(text) => setRentFare(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Room Size"
        value={roomSize}
        onChangeText={(text) => setRoomSize(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={zipcode}
        onChangeText={(text) => setzipcode(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
        <Text style={styles.buttonText}>Add Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default Postscreen;

