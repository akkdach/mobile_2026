// RecommendPartsScreen.tsx
import React, { useState, useContext, createContext, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AppBar from '../../../components/AppBar';
import { COLOR } from '../../../constants/Colors';
import { fetchGetMaterialMaster, fetchGetRecommentPart, fetchSaveRecommentPart } from '../../../services/sparePart';
import Loading from '../../../components/loading';
import { on } from 'form-data';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';

type Part = {
  code: string;
  name: string;
  quantity?: number;
  balance?: number;
};

type RecommendPartContextType = {
  recommendedParts: Part[];
  setRecommendedParts: (parts: Part[]) => void;
};

const RecommendPartContext = createContext<RecommendPartContextType>({
  recommendedParts: [],
  setRecommendedParts: () => { },
});

const generateParts = (start: number, count: number): Part[] =>
  Array.from({ length: count }, (_, i) => ({
    code: `P${start + i}`,
    name: `อะไหล่ที่ ${start + i}`,
    balance: Math.floor(Math.random() * 100),
  }));

const RecommendPartsScreen = (props: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const { orderId, type, orderTypeDescription, IsConnectivity } =
    props?.workOrderData;
  // console.log('workOrderData', orderId)
  // const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParts, setSelectedParts] = useState<Part[]>([]);
  const [allParts, setAllParts] = useState<Part[]>([]);
  const [page, setPage] = useState(0);
  const [recommendedParts, setRecommendedParts] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const PAGE_SIZE = 100;
  const [technicianNote, setTechnicianNote] = useState('');
  useEffect(() => {
    // loadMoreParts();
    onLoadMaster();
    onGet();
  }, []);

  const onMapMaster = (data: any) => {
    const newData = data.map((item: any) => {
      return { code: item.material, name: item.description }
    })
    setAllParts(newData);
  }
  const onLoadMaster = async () => {
    setIsLoading(true);
    const res = await fetchGetMaterialMaster()
    setIsLoading(false);
    if (res.isSuccess) {
      onMapMaster(res?.dataResult)
    } else {
      Alert.alert(res.message);
    }
  }

  const onGet = async () => {
    var res = await fetchGetRecommentPart(orderId);
    if (res.isSuccess) {
      setRecommendedParts(res?.dataResult ?? []);
    }
  }

  const onSave = async (data: any) => {
    setIsLoading(true);
    const res = await fetchSaveRecommentPart(data)
    if (res.isSuccess) {
      setIsLoading(false);
      Alert.alert('บันทึกสำเร็จ', '', [
        { text: 'ปิด', onPress: () => Actions.pop() },
      ]);
    } else {
      Alert.alert(res.message);
    }
  }

  const loadMoreParts = () => {
    const newParts = generateParts(page * PAGE_SIZE, PAGE_SIZE);
    setAllParts(prev => [...prev, ...newParts]);
    setPage(prev => prev + 1);
  };

  const toggleSelect = (part: Part) => {
    const exists = selectedParts.find(p => p.code === part.code);
    if (exists) {
      setSelectedParts(selectedParts.filter(p => p.code !== part.code));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const handleSubmit = () => {
    setRecommendedParts(selectedParts);

    setModalVisible(false);
  };

  // useEffect(() => {
  //   console.log('รายการอะไหล่ที่แนะนำ', recommendedParts)
  // }, [recommendedParts])

  const handleSave = () => {
    console.log('Saved parts:', recommendedParts);
    const data = {
      orderId: orderId,
      note: technicianNote,
      line: recommendedParts
    }
    onSave(data);


  };
  const handleClose = () => {
    Actions.pop()
  }

  const filteredParts = useMemo(() => {
    const keyword = searchText.toLowerCase();
    return allParts.filter(
      part =>
        part.code.toLowerCase().includes(keyword) ||
        part.name.toLowerCase().includes(keyword)
    );
  }, [searchText, allParts]);
  return (
    <SafeAreaView style={styles.container}>
      <AppBar title="Recommend Spare Part" ></AppBar>
      <FlatList
        data={recommendedParts}
        keyExtractor={(item, index) => item.code ?? index.toString()}

        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>📦 {item.code}</Text>
            <Text style={styles.text}>🔧 {item.name}</Text>
            {/* <Text style={styles.text}>จำนวน: {item.quantity ?? 1}</Text> */}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>ไม่มีรายการแนะนำ</Text>}
      />
      <View style={{ padding: 5 }} >
        <Text style={styles.label}>📝 หมายเหตุสำหรับช่าง</Text>
        <TextInput
          placeholder="กรอกหมายเหตุ เช่น จุดติดตั้ง หรือปัญหาที่พบ"
          value={technicianNote}
          onChangeText={setTechnicianNote}
          style={styles.noteInput}
        />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={handleClose} >
          <Text style={styles.buttonText}>❌ ยกเลิก</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAdd} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>➕ เพิ่ม</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
          <Text style={styles.buttonText}>💾 บันทึก</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.title}>📋 เลือกอะไหล่</Text>
          <TextInput
            placeholder="🔍 ค้นหาอะไหล่ตามรหัสหรือชื่อ"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchBox}
          />
          <FlatList
            data={filteredParts}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => {
              const isSelected = selectedParts.some(p => p.code === item.code);
              return (
                <TouchableOpacity
                  style={[styles.item, isSelected && styles.selected]}
                  onPress={() => toggleSelect(item)}
                >
                  <Text style={styles.text}>🔩 {item.code} - {item.name}</Text>
                  {/* <Text style={styles.text}>คงเหลือ: {item.balance}</Text> */}
                  <Text style={styles.text}>{isSelected ? '✅ เลือกแล้ว' : '☐'}</Text>
                </TouchableOpacity>
              );
            }}
            onEndReached={loadMoreParts}
            onEndReachedThreshold={0.5}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>❌ ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSave} onPress={handleSubmit}>
              <Text style={styles.buttonText}>✅ ตกลง</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Loading loading={isLoading} />
    </SafeAreaView>
  );
};

// export const RecommendPartsProvider = ({ children }: { children: React.ReactNode }) => {

//   return (
//     <RecommendPartContext.Provider value={{ recommendedParts, setRecommendedParts }}>
//       {children}
//     </RecommendPartContext.Provider>
//   );
// };

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: '#fff' },
  modalContainer: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#ddd' },
  selected: { backgroundColor: '#e0f7fa' },
  text: { fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, padding: 5 },
  buttonCancel: { backgroundColor: COLOR.gray, padding: 10, borderRadius: 6, width: '30%', alignItems: 'center' },
  buttonAdd: { backgroundColor: COLOR.orange, padding: 10, borderRadius: 6, width: '30%', alignItems: 'center' },
  buttonSave: { backgroundColor: COLOR.primary, padding: 10, borderRadius: 6, width: '30%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  searchBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#000'
  }, label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default RecommendPartsScreen;