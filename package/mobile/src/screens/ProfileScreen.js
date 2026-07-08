import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cover} />
        <Image
          source={{ uri: 'https://ui-avatars.com/api/?name=Admin&background=1877F2&color=fff&size=200' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Administrator</Text>
        <Text style={styles.bio}>Bug hunter & security enthusiast</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>👥 Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>💬 Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🔖 Bookmarks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🐛 Bug Bounty</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  cover: {
    width: '100%',
    height: 150,
    backgroundColor: '#1877F2',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    marginTop: -50,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bio: {
    fontSize: 14,
    color: '#65676b',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  menuText: {
    fontSize: 16,
  },
});
