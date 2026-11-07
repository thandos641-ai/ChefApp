
import React, { useContext, useState } from 'react';
import {
  Alert, SafeAreaView, View, Text,
  TouchableOpacity, StyleSheet, FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { OrdersContext, Order } from '../context/orderscontext';

export default function OrdersScreen() {
  const router = useRouter();
  const context = useContext(OrdersContext);
  const [filter, setFilter] = useState('All');

  if (!context) return null;

  const { orders, updateOrderStatus, deleteOrder } = context;

  const filteredOrders = orders.filter(order =>
    filter === 'All' || order.status === filter
  );

  const revenue = orders
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.total, 0);

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.table}>Table {item.tableNumber}</Text>
      <Text style={styles.time}>{item.timestamp}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>

      {item.items.map((food, index) => (
        <Text key={index} style={styles.food}>
          {food.quantity}x {food.name} - R {(food.price * food.quantity).toFixed(2)}
        </Text>
      ))}

      <Text style={styles.total}>Total: R {item.total.toFixed(2)}</Text>

      {item.status === 'Pending' && (
        <TouchableOpacity style={styles.prepare} onPress={() => updateOrderStatus(item.id, 'Preparing')}>
          <Text style={styles.buttonText}>Start Cooking</Text>
        </TouchableOpacity>
      )}

      {item.status === 'Preparing' && (
        <TouchableOpacity style={styles.complete} onPress={() => updateOrderStatus(item.id, 'Completed')}>
          <Text style={styles.buttonText}>Mark Completed</Text>
        </TouchableOpacity>
      )}

      {item.status === 'Completed' && (
        <TouchableOpacity
          style={styles.clear}
          onPress={() => Alert.alert('Clear Order', 'Remove this order?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => deleteOrder(item.id) },
          ])}
        >
          <Text style={styles.buttonText}>Clear Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/menu')}>
          <Text style={styles.link}>← Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text style={styles.link}>Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statText}>
          Active Orders: {orders.filter(o => o.status !== 'Completed').length}
        </Text>
        <Text style={styles.statText}>
          Revenue: R {revenue.toFixed(2)}
        </Text>
      </View>

      <View style={styles.filters}>
        {['All', 'Pending', 'Preparing', 'Completed'].map(status => (
          <TouchableOpacity key={status} onPress={() => setFilter(status)}>
            <Text style={[styles.filter, filter === status && styles.activeFilter]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={<Text style={styles.empty}>No orders available.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, backgroundColor: '#FFF' },
  link: { color: '#3498DB', fontWeight: 'bold' },
  stats: { backgroundColor: '#34495E', padding: 20, flexDirection: 'row', justifyContent: 'space-around' },
  statText: { color: '#FFF', fontWeight: 'bold' },
  filters: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, backgroundColor: '#FFF' },
  filter: { color: '#777', padding: 6 },
  activeFilter: { color: '#3498DB', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 15, elevation: 3 },
  table: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  time: { color: '#999', marginBottom: 10 },
  status: { color: '#3498DB', fontWeight: 'bold', marginBottom: 10 },
  food: { marginBottom: 6, color: '#555' },
  total: { fontWeight: 'bold', color: '#27AE60', marginVertical: 12 },
  prepare: { backgroundColor: '#3498DB', padding: 12, borderRadius: 7, alignItems: 'center' },
  complete: { backgroundColor: '#2ECC71', padding: 12, borderRadius: 7, alignItems: 'center' },
  clear: { backgroundColor: '#95A5A6', padding: 12, borderRadius: 7, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
});
