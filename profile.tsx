
import React, { useContext } from 'react';
import {
  Alert, SafeAreaView, View, Text,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          auth?.logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👨‍🍳</Text>
        <Text style={styles.name}>Chef Account</Text>
        <Text style={styles.email}>{auth?.userEmail || 'Not logged in'}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.item} onPress={() => router.replace('/menu')}>
          <Text style={styles.itemText}>🏠 Menu Manager</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => router.push('/orders')}>
          <Text style={styles.itemText}>📋 Kitchen Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Text style={styles.logout}>🚪 Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  avatar: { fontSize: 65 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50' },
  email: { color: '#7F8C8D', marginTop: 8 },
  menu: { backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden' },
  item: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  itemText: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
  logout: { color: '#E74C3C', fontWeight: 'bold', fontSize: 16 },
});
