
import React, { useContext, useState } from 'react';
import {
  Alert, SafeAreaView, View, Text, TextInput,
  TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Error', 'Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must have at least 6 characters.');
      return;
    }

    if (!auth) return;

    auth.login(email.trim());
    router.replace('/menu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>👨‍🍳</Text>
          <Text style={styles.title}>Chef's Menu Manager</Text>
          <Text style={styles.subtitle}>Sign in to manage your kitchen</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="chef@restaurant.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  inner: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 35 },
  logo: { fontSize: 60 },
  title: { fontSize: 25, fontWeight: 'bold', color: '#2C3E50' },
  subtitle: { color: '#7F8C8D', marginTop: 8 },
  form: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, elevation: 4 },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#34495E' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 14, marginBottom: 15 },
  button: { backgroundColor: '#3498DB', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
