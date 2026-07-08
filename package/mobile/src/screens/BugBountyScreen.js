import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function BugBountyScreen() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🐛 Bug Bounty Program</Text>
        <Text style={styles.headerSubtitle}>Learning environment for security testing</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ Warning</Text>
        <Text style={styles.warningText}>
          This is a PRACTICE environment. Do not use these techniques on real systems without permission.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Vulnerabilities to Practice</Text>
        
        <View style={styles.vulnItem}>
          <Text style={styles.vulnTitle}>IDOR</Text>
          <Text style={styles.vulnDesc}>Insecure Direct Object Reference</Text>
        </View>

        <View style={styles.vulnItem}>
          <Text style={styles.vulnTitle}>XSS</Text>
          <Text style={styles.vulnDesc}>Cross-Site Scripting</Text>
        </View>

        <View style={styles.vulnItem}>
          <Text style={styles.vulnTitle}>CSRF</Text>
          <Text style={styles.vulnDesc}>Cross-Site Request Forgery</Text>
        </View>

        <View style={styles.vulnItem}>
          <Text style={styles.vulnTitle}>Auth Bypass</Text>
          <Text style={styles.vulnDesc}>Authentication & Session Issues</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ Tools</Text>
        
        <TouchableOpacity style={styles.toolItem} onPress={() => openLink('https://portswigger.net/burp')}>
          <Text style={styles.toolName}>Burp Suite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolItem} onPress={() => openLink('https://www.zaproxy.org')}>
          <Text style={styles.toolName}>OWASP ZAP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolItem} onPress={() => openLink('https://owasp.org/www-project-top-ten')}>
          <Text style={styles.toolName}>OWASP Top 10</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Learn More</Text>
        
        <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://portswigger.net/web-security')}>
          <Text style={styles.linkText}>PortSwigger Web Security Academy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://hackerone.com/ctf')}>
          <Text style={styles.linkText}>HackerOne CTF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://bugcrowd.com/university')}>
          <Text style={styles.linkText}>Bugcrowd University</Text>
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
    backgroundColor: '#1877F2',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    lineHeight: 20,
  },
  vulnItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  vulnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1877F2',
  },
  vulnDesc: {
    fontSize: 14,
    color: '#65676b',
    marginTop: 2,
  },
  toolItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  toolName: {
    fontSize: 16,
    color: '#1877F2',
  },
  linkItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  linkText: {
    fontSize: 16,
    color: '#1877F2',
  },
});
