import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Caregiver = {
  id: string;
  name: string;
  location: string;
};

const caregivers: Caregiver[] = [
  { id: '1', name: 'คุณสมชาย', location: 'กรุงเทพฯ' },
  { id: '2', name: 'คุณวิไล', location: 'เชียงใหม่' },
  { id: '3', name: 'คุณอารีย์', location: 'ขอนแก่น' },
];

const AutocompleteCaregiver = () => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(caregivers);

  const handleSearch = (text: string) => {
    setQuery(text);
    const result = caregivers.filter(c =>
      c.name.toLowerCase().includes(text.toLowerCase()) ||
      c.location.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(result);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ค้นหาผู้ดูแล..."
        value={query}
        onChangeText={handleSearch}
      />
      {query.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Text>{item.name} - {item.location}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AutocompleteCaregiver;
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
});