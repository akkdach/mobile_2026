import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    Alert,
} from 'react-native';
import { ISparePartRequestHD, ISparePartRequestItem } from '../../models/WorkOrderSparePart';
import {
    fetchSparePartRequestApprove,
    fetchSparePartRequestCancel,
    fetchSparePartRequestHd,
    fetchSparePartRequestHdVan,
    fetchSparePartRequestItem,
    fetchSparePartTransferRequest,
    postSparePartReservationRequest,
} from '../../services/sparePart';

import moment from 'moment';
import Loading from '../../components/loading';

type ItemDetail = {
    no: string;
    des: string;
    qty: number;
    unit: string;
};



type IProps = {
    hd: ISparePartRequestHD[],
    wk_ctr:string,
    reload:()=>void;
}




const TransferRequestCardList: React.FC<IProps> = (props: IProps) => {

    const [selectedRequest, setSelectedRequest] = useState<ISparePartRequestHD | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [SparePartRequestItem, setSparePartRequestItem] = useState<ISparePartRequestItem[]>([],);
    const [SparePartRequestHDDetail, setSparePartRequestHDDetail] = useState<ISparePartRequestHD>();
    const [isLoading, setIsLoading] = useState(false);

    const handleViewDetail = async (item: ISparePartRequestHD) => {
        setIsLoading(true)
        setSparePartRequestHDDetail(item);
        const result = await fetchSparePartRequestItem(item.reS_ID);
        if (result.dataResult) {
            setSparePartRequestItem(result.dataResult)
        }

        setModalVisible(true);
        setIsLoading(false)

        setSelectedRequest(item);
        setModalVisible(true);
    };


    const onCancel = async () => {
        var resId = SparePartRequestHDDetail?.reS_ID;
        if (!resId) {
            resId = 0;
        }
        setIsLoading(true);
        var result = await fetchSparePartRequestCancel(resId.toString());
        setIsLoading(false)
        if (result.isSuccess == true) {
            setModalVisible(false)
            props.reload();
            Alert.alert("เตือน", "บันทึกสำเร็จ")
        } else {
            Alert.alert("ผิดพลาด", result.message);
        }
    }

    const onApprove = async () => {
        var resId = SparePartRequestHDDetail?.reS_ID
        if (!resId) {
            resId = 0;
        }
        var result = await fetchSparePartRequestApprove(resId.toString());
        if (result.isSuccess == true) {
            setModalVisible(false)
            props.reload();
            Alert.alert("เตือน", result.message)
        } else {
            Alert.alert("ผิดพลาด", result.message);
        }
    }

    const renderItem = ({ item }: { item: ISparePartRequestHD }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.title}>📋 เลขที่คำขอโอน : {item.reS_ID}</Text>
                <Text style={styles.title}>📋 เลขที่ใบโอน : {item.reservatioN_NO}</Text>
                <Text style={styles.text}>📅 วันที่ขอ: {moment(item.reS_DATE).format('D/M/Y')} , เวลา {moment(item.reS_DATE).format('HH:ss')} น.</Text>
                <Text style={styles.text}>🚐 ผู้ขอ {item.wK_CTR ??''}, ขอจาก: {item.froM_VAN ??''}</Text>
                <DisplayStatus status={item.isApprove}  />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => handleViewDetail(item)}>
                <Text style={styles.buttonText}>ดูรายละเอียด</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View  style={{paddingBottom:150}}>

            <FlatList
                data={props.hd}
                renderItem={renderItem}
                keyExtractor={(item) => item.reS_ID.toString()}
                contentContainerStyle={styles.list}
            />

            {/* Modal แสดงรายละเอียด */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>📋 รายละเอียดสินค้า</Text>

                        <FlatList
                            data={SparePartRequestItem || []}
                            keyExtractor={(item, index) => `${item.resId}-${index}`}
                            contentContainerStyle={stylesModal.itemList}
                            renderItem={({ item }) => (
                                <View style={stylesModal.itemCard}>
                                    <View style={stylesModal.itemRow}>
                                        <Text style={stylesModal.itemLabel}>รหัส:</Text>
                                        <Text style={stylesModal.itemValue} numberOfLines={1} ellipsizeMode="tail">
                                            {item.material}
                                        </Text>
                                    </View>
                                    <View style={stylesModal.itemRow}>
                                        <Text style={stylesModal.itemLabel}>รายการ:</Text>
                                        <Text style={stylesModal.itemValue} numberOfLines={2} ellipsizeMode="tail">
                                            {item.des}
                                        </Text>
                                    </View>
                                    <View style={stylesModal.itemRow}>
                                        <Text style={stylesModal.itemLabel}>จำนวน:</Text>
                                        <Text style={stylesModal.itemValue}>{item.qty} {item.unit}</Text>
                                    </View>
                                </View>
                            )}
                        />
                        {props.wk_ctr && <>
                        <View style={stylesModal.buttonRow}>
                            {props.wk_ctr == props?.hd[0]?.froM_VAN && <Pressable style={stylesModal.approveButton} onPress={() => {
                                Alert.alert(
                                    'ยืนยันการดำเนินการ',
                                    'คุณต้องการอนุมัติรายการนี้หรือไม่?',
                                    [
                                        {
                                            text: '❌ ยกเลิก',
                                            onPress: () => console.log('ยกเลิก'),
                                            style: 'cancel',
                                        },
                                        {
                                            text: '✅ ยืนยัน',
                                            onPress: () => onApprove(),
                                        },
                                    ],
                                    { cancelable: true }
                                );

                            }}>
                                <Text style={stylesModal.buttonText}>✅ อนุมัติ</Text>
                            </Pressable>}
                            <Pressable style={stylesModal.rejectButton} onPress={() => {
                                Alert.alert(
                                    'ยืนยันการดำเนินการ',
                                    'คุณต้องการยกเลิกรายการนี้หรือไม่?',
                                    [
                                        {
                                            text: '❌ ยกเลิก',
                                            onPress: () => console.log('ยกเลิก'),
                                            style: 'cancel',
                                        },
                                        {
                                            text: '✅ ยืนยัน',
                                            onPress: () => onCancel(),
                                        },
                                    ],
                                    { cancelable: true }
                                );

                            }}>
                                <Text style={stylesModal.buttonText}>❌ ยกเลิก</Text>
                            </Pressable>
                           
                        </View>
                            </>}
                        <Pressable style={stylesModal.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={stylesModal.closeText}>ปิด</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Loading loading={isLoading} />
        </View>
    );
};

type StatusType = 'N' | 'Y';

interface DisplayStatusProps {
    status: string;
}

const DisplayStatus: React.FC<DisplayStatusProps> = ({ status }) => {
    const isPending = status === 'N';

    return (
        <View style={[styles.container, isPending ? styles.pending : styles.completed]}>
            <Text style={styles.text}>
                {isPending ? '⏳ รออนุมัติ' : '✅ อนุมัติ'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    cardContent: {
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#333',
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    button: {
        alignSelf: 'flex-start',
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 6,
        width: '100%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 13,
        textAlign: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '85%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'center',
    },
    itemText: {
        fontSize: 14,
        color: '#444',
    },
    closeButton: {
        marginTop: 16,
        alignSelf: 'center',
        backgroundColor: '#ccc',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeText: {
        fontSize: 14,
        color: '#333',
    },
    itemList: {
        paddingBottom: 12,
    },
    itemCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    itemValue: {
        fontSize: 14,
        color: '#333',
    }, container: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    pending: {
        backgroundColor: '#fceabb',
    },
    completed: {
        backgroundColor: '#c6f6d5',
    }
});

const stylesModal = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
    },
    itemList: {
        paddingBottom: 12,
    },
    itemCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        elevation: 1,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    itemLabel: {
        fontWeight: 'bold',
        width: 80,
        color: '#34495e',
    },
    itemValue: {
        flex: 1,
        color: '#2c3e50',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    approveButton: {
        backgroundColor: '#2ecc71',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 6,
    },
    rejectButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 6,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 12,
        alignSelf: 'center',
        padding: 10,
    },
    closeText: {
        color: '#3498db',
        fontWeight: 'bold',
    },
});
export default TransferRequestCardList;