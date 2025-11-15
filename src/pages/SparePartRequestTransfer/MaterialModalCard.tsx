import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import defaultImage  from '../../../assets/images/data_not_found.png';
type MaterialItem = {
    id: string;
    material: string;
    materialDescription: string;
    quantity: number;
    unit: string;
    imageUrl: string;
};

type Props = {
    visible: boolean;
    materials: MaterialItem[];
    onClose: () => void;
    onConfirm: (selected: { id: string; qty: number }[]) => void;
};
const MaterialFullScreenModal: React.FC<Props> = ({ visible, materials, onClose, onConfirm }) => {
    const [qtyMap, setQtyMap] = useState<{ [id: string]: number }>({});
    // const [searchText, setSearchText] = useState('');
    const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);

    useEffect(()=>{
        setFilteredMaterials(materials)
    },[])
    const handleQtyChange = (id: string, value: string) => {
        const num = parseInt(value, 10);
        setQtyMap(prev => ({ ...prev, [id]: isNaN(num) ? 0 : num }));
    };

    const handleConfirm = () => {
        const selected = Object.entries(qtyMap)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({ id, qty }));
        onConfirm(selected);
        setQtyMap({});
        onClose();
    };

    const handleSearch = async (searchText:string)=> {
        
        if (searchText) {
            var newFilter = materials.filter(item =>
                item.material.toLowerCase().includes(searchText.toLowerCase()) ||
                item.materialDescription.toLowerCase().includes(searchText.toLowerCase())
            )
            console.log(newFilter);
            setFilteredMaterials(newFilter);
        } else {
            setFilteredMaterials(materials);
        }
    }

    const renderItem = ({ item }: { item: MaterialItem }) => {
        const qty = qtyMap[item.id] || 0;
        const remaining = item.quantity - qty;

        return (
            <View style={styles.card}>
                <Image source={{ uri: defaultImage }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.code}>{item.material}</Text>
                    <Text style={styles.name}>{item.materialDescription}</Text>
                    {/* <Text style={styles.unit}>หน่วย: {item.unit}</Text> */}
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={styles.quantity}>คงเหลือ: {remaining} / {item.unit}</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="จำนวนที่เบิก"
                            value={qty.toString()}
                            onChangeText={val => handleQtyChange(item.id, val)}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const RenderFlash = ()=>{
        return                 <FlatList
                    data={filteredMaterials}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
    }
    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.fullscreen}>
                <Text style={styles.header}>รายการอะไหล่</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="ค้นหาอะไหล่หรือรหัส..."
                    // value={searchText}
                    onChangeText={handleSearch}
                />
                <RenderFlash />
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                        <Text style={styles.buttonText}>ตกลง</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.buttonText}>ยกเลิก</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MaterialFullScreenModal;

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
        backgroundColor: '#FAFAFA', // สีพื้นหลังอ่อน
        paddingHorizontal: 0,
        paddingTop: 40,
        margin: 'auto',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: '#333',
    },
    searchInput: {
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#B0BEC5',
        borderRadius: 0,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD', // ฟ้าอ่อน
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 6,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#90CAF9',
    },
    info: {
        flex: 1,
    },
    code: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#0D47A1',
    },
    name: {
        fontSize: 13,
        color: '#1A237E',
    },
    unit: {
        fontSize: 12,
        color: '#455A64',
    },
    quantity: {
        fontSize: 12,
        marginTop: 4,
        color: '#004D40',
    },
    input: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#B0BEC5',
        borderRadius: 0,
        paddingHorizontal: 8,
        height: 36,
        backgroundColor: '#FFFFFF',
        textAlign: 'center'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 16,
        backgroundColor: '#ECEFF1',
        borderTopWidth: 1,
        borderColor: '#CFD8DC',
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        marginHorizontal: 2,
        width: '50%',
        backgroundColor: '#0288D1',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginHorizontal: 2,
        width: '50%',
        backgroundColor: '#F90101',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelText: {
        color: '#0288D1',
        fontSize: 16,
    },
});