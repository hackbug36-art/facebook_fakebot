import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Video from 'react-native-video';
import { WebView } from 'react-native-webview';

const API_BASE = 'http://localhost:8080';

export default function MediaScreen({ navigation }) {
  const [media, setMedia] = useState({ videos: [], music: [] });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const [videosRes, musicRes] = await Promise.all([
        fetch(`${API_BASE}/api/engine/media/videos`),
        fetch(`${API_BASE}/api/engine/media/music`),
      ]);

      const videosData = await videosRes.json();
      const musicData = await musicRes.json();

      setMedia({
        videos: videosData.videos || [],
        music: musicData.music || [],
      });
    } catch (error) {
      console.error('Failed to load media:', error);
    }
  };

  if (selectedVideo) {
    return (
      <View style={styles.playerContainer}>
        <Video
          source={{ uri: selectedVideo.url }}
          style={styles.video}
          controls
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedVideo(null)}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedMusic) {
    return (
      <View style={styles.playerContainer}>
        <View style={styles.musicPlayer}>
          <Image
            source={{ uri: selectedMusic.cover || 'https://ui-avatars.com/api/?name=Music' }}
            style={styles.albumArt}
          />
          <Text style={styles.trackTitle}>{selectedMusic.title}</Text>
          <Text style={styles.trackArtist}>{selectedMusic.artist}</Text>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMusic(null)}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>🎬 Videos</Text>
      {media.videos.map(video => (
        <TouchableOpacity
          key={video.id}
          style={styles.mediaCard}
          onPress={() => setSelectedVideo(video)}
        >
          <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaTitle}>{video.title}</Text>
            <Text style={styles.mediaMeta}>{video.views} views • {video.duration}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>🎵 Music</Text>
      {media.music.map(track => (
        <TouchableOpacity
          key={track.id}
          style={styles.mediaCard}
          onPress={() => setSelectedMusic(track)}
        >
          <Image source={{ uri: track.cover }} style={styles.albumArtSmall} />
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaTitle}>{track.title}</Text>
            <Text style={styles.mediaMeta}>{track.artist} • {track.plays} plays</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 15,
    marginBottom: 10,
  },
  mediaCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 120,
    height: 80,
  },
  albumArtSmall: {
    width: 80,
    height: 80,
  },
  mediaInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  mediaTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaMeta: {
    fontSize: 12,
    color: '#65676b',
  },
  playerContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: 300,
  },
  musicPlayer: {
    alignItems: 'center',
    padding: 30,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  trackArtist: {
    fontSize: 16,
    color: '#ccc',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
