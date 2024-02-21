
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';

const Myposts = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
  
    const fetchPosts = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userInfoResponse = await axios.post('http://192.168.254.160:3000/user-info', { token });
        const userEmail = userInfoResponse.data.user.email;
  
        const response = await axios.get(`http://192.168.254.160:3000/myposts/${userEmail}`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    useFocusEffect(
      useCallback(() => {
        fetchPosts();
      }, [])
    );
  
    const handleDeletePost = async (postId) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        // console.log('Deleting post with id:', postId);
  
        await axios.delete(`http://192.168.254.160:3000/deletepost/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // Fetch posts after successful deletion
        fetchPosts();
      } catch (error) {
        // console.error('Error deleting post:', error);
        Alert.alert('Error', 'Failed to delete post. Please try again.');
      }
    };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Posts</Text>
  
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text>{`Post ${index + 1}`}</Text>
              <Text style={styles.cardText}>Name: {item.name}</Text>
              <Text style={styles.cardText}>Rent Fare: {item.rentfare}</Text>
              <Text style={styles.cardText}>Room Size: {item.roomsize}</Text>
              <Text style={styles.cardText}>Description: {item.description}</Text>
              <Text style={styles.cardText}>Address: {item.address}</Text>
              <Text style={styles.cardText}>Pincode: {item.pincode}</Text>

              {/* Delete icon */}
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeletePost(item._id)}
              >
                <Ionicons name="trash-outline" size={24} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>No posts found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 70,
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    marginBottom: 25,
    paddingTop: 40,
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#ABEBC6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    flexDirection: 'column',
    alignItems: 'left',
  },
  cardText: {
    fontSize: responsiveFontSize(2.2),
    marginBottom: 5,
  },
  deleteIcon: {
    marginLeft: 'auto', // Push the icon to the right side
  },
});

export default Myposts;

