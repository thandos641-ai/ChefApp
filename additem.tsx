import React, { useContext, useEffect, useState } from 'react';
import {
  Alert, SafeAreaView, View, Text, TextInput,
  TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MenuContext } from '../context/MenuContext';

const defaultImageUrl = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600';

export default function AddItemScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const context = useContext(MenuContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);

  useEffect(() => {
    if (!context || !id) return;

    const item = context.getItem(id);

    if (item) {
      setName(item.name);
      setDescription(item.description);
      setCourse(item.course);
      setPrice(String(item.price));
      setImageUrl(item.imageUrl || defaultImageUrl);
    }
  }, [id, context]);

  if (!context) return null;

  const handleSave = () => {
    if (!name.trim() || !description.trim() || !course || !price.trim()) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    const amount = Number(price);

    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert('Error', 'Enter a valid price.');
      return;
    }

    const data = {
      name: name.trim(),
      description: description.trim(),
      course,
      price: amount,
      imageUrl: imageUrl || defaultImageUrl,
    };

    if (id) {
      context.updateItem(id, data);
    } else {
      context.addItem(data);
    }

    Alert.alert('Success', 'Menu item saved successfully.');
    router.replace('/menu');
  };

  const handleDelete = () => {
    if (!id) return;

    Alert.alert('Delete Meal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          context.deleteItem(id);
          router.replace('/menu');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{id ? 'Edit Menu Item' : 'Add New Item'}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Dish name" />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.description]} value={description} onChangeText={setDescription} placeholder="Description" multiline />

          <Text style={styles.label}>Course</Text>
          <View style={styles.courses}>
            {['Starter', 'Main', 'Dessert', 'Beverage'].map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.courseButton, course === item && styles.selected]}
                onPress={() => setCourse(item)}
              >
                <Text style={course === item ? styles.selectedText : styles.courseText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Price (R)</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="Price" />

          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Image URL"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.save} onPress={handleSave}>
            <Text style={styles.buttonText}>{id ? 'Update Item' : 'Add to Menu'}</Text>
          </TouchableOpacity>

          {id && (
            <TouchableOpacity style={styles.delete} onPress={handleDelete}>
              <Text style={styles.deleteText}>Delete Meal</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancel} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { padding: 20 },
  title: { fontSize: 25, fontWeight: 'bold', color: '#2C3E50', marginBottom: 20 },
  form: { backgroundColor: '#FFF', padding: 20, borderRadius: 12 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 8, color: '#34495E' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 8 },
  description: { height: 100, textAlignVertical: 'top' },
  courses: { flexDirection: 'row', flexWrap: 'wrap' },
  courseButton: { backgroundColor: '#EEE', padding: 10, borderRadius: 20, margin: 4 },
  selected: { backgroundColor: '#3498DB' },
  courseText: { color: '#333' },
  selectedText: { color: '#FFF', fontWeight: 'bold' },
  save: { backgroundColor: '#2ECC71', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  delete: { padding: 15, borderWidth: 1, borderColor: '#E74C3C', borderRadius: 8, alignItems: 'center', marginTop: 10 },
  deleteText: { color: '#E74C3C', fontWeight: 'bold' },
  cancel: { padding: 15, alignItems: 'center' },
  cancelText: { color: '#777' },
});
