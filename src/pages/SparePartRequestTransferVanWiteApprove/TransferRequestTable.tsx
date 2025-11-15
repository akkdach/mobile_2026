
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const transferRequests = [
  {
    id: 'TR001',
    date: '2025-08-25',
    van: 'VAN-12',
    status: 'รอดำเนินการ',
  },
  {
    id: 'TR002',
    date: '2025-08-24',
    van: 'VAN-08',
    status: 'เสร็จสิ้น',
  },
  // เพิ่มรายการอื่น ๆ ได้ตามต้องการ
];

const TransferRequestTable = ({ onViewDetail }:any) => {
  const renderItem = ({ item }:any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.van}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => onViewDetail(item)}>
        <Text style={styles.actionText}>ดูรายละเอียด</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerCell}>เลขที่</Text>
        <Text style={styles.headerCell}>วันที่ขอ</Text>
        <Text style={styles.headerCell}>VAN</Text>
        <Text style={styles.headerCell}>สถานะ</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>
      <FlatList  
        data={transferRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    color: '#007bff',
  },
});

export default TransferRequestTable;