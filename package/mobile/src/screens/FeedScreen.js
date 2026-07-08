import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

const API_BASE = 'http://localhost:8080';

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/posts`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.authorAvatar || 'https://ui-avatars.com/api/?name=User' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.authorName}>{item.authorName}</Text>
          <Text style={styles.timestamp}>{item.createdAt}</Text>
        </View>
      </View>

      <Text style={styles.content}>{item.content}</Text>

      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}

      <View style={styles.stats}>
        <Text style={styles.statText}>{item.likesCount} likes</Text>
        <Text style={styles.statText}>{item.commentsCount} comments</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  list: {
    padding: 10,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  timestamp: {
    fontSize: 12,
    color: '#65676b',
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ced0d4',
  },
  statText: {
    fontSize: 14,
    color: '#65676b',
  },
});
