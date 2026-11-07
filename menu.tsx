import React, { useContext, useState } from 'react';
import {
  Alert, SafeAreaView, View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MenuContext, MenuItem } from '../context/MenuContext';
import { SearchBar } from '../components/searchbar';
import { MenuList } from '../components/menulist';

export default function MenuScreen() {
  const router = useRouter();
  const context = useContext(MenuContext);
  const [searchQuery, setSearchQuery] = useState('');

  if (!context) return null;

  const { menuItems, deleteItem } = context;

  const handleDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
    ]);
  };

  const handleEdit = (item: MenuItem) => {
    router.push({ pathname: '/additem', params: { id: item.id } });
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chef's Menu Manager</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.navigation}>
  <TouchableOpacity onPress={() => router.push('/menu')}>
    <Text style={styles.navText}>Menu</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('/orders')}>
    <Text style={styles.navText}>Orders</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('/profile')}>
    <Text style={styles.navText}>Profile</Text>
  </TouchableOpacity>
</View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.stats}>
          <Text style={styles.statText}>Total Items: {menuItems.length}</Text>
        </View>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <MenuList
          menuItems={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <TouchableOpacity
          style={styles.ordersButton}
          onPress={() => router.push('/orders')}
        >
          <Text style={styles.ordersText}>View Kitchen Orders</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/additem')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navigation: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  padding: 15,
  backgroundColor: '#34495e',
},

navText: {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
},
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, backgroundColor: '#FFF' },
  title: { fontSize: 19, fontWeight: 'bold', color: '#2C3E50' },
  icon: { fontSize: 25 },
  scroll: { padding: 20, paddingBottom: 100 },
  stats: { backgroundColor: '#34495E', padding: 18, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  statText: { color: '#FFF', fontWeight: 'bold' },
  ordersButton: { backgroundColor: '#34495E', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  ordersText: { color: '#FFF', fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 25, right: 20, backgroundColor: '#2ECC71', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#FFF', fontSize: 32 },
});