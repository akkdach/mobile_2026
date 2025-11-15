import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BackGroundImage from '../../components/BackGroundImage';
import AppBar from '../../components/AppBar';
import { ROUTE } from '../../constants/RoutePath';
import Loading from '../../components/loading';
import { getClaimList } from '../../services/ClaimList';
import moment from 'moment';


// const claimParts = [
//     {
//         orderId: '000087336363',
//         finishDate: '2025-08-20',
//         material: '4712345',
//         description: 'มอเตอร์ตู้เย็น',
//         quantity: 1,
//         unit: 'ชิ้น',
//         status: 'รอเคลม',
//         to_number: ''
//     },
// ];

const ClaimPartsScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchclaimParts = async () => {
        try {
            setIsLoading(true);
            const res = await getClaimList();
            setData(res.dataResult || []);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchclaimParts();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.title}>📦 Order ID: {item.orderid}</Text>
            <Text style={styles.subtitle}>🗓️ Finish Date: {moment(item.creatE_AT).format('DD/MM/YYYY HH:mm:ss ')}</Text>
            <Text style={styles.label}>รหัสสินค้า: <Text style={styles.value}>{item.material}</Text></Text>
            <Text style={styles.label}>รหัสของเสีย: <Text style={styles.value}>{item.materiaL_DAMAGE}</Text></Text>
            <Text style={styles.label}>รายละเอียด: <Text style={styles.value}>{item.description}</Text></Text>
            <Text style={styles.label}>จำนวน: <Text style={styles.value}>{item.actuaL_QUANTITY} {item.unit}</Text></Text>
            <Text style={styles.label}>เลขที่ใบโอน: <Text style={styles.value}>{item?.tO_NUMBER2}</Text></Text>
            <Text style={styles.label}>เลขที่ใบปรับปรุงยอดของเสีย: <Text style={styles.value}>{item.tO_NUMBER}</Text></Text>
            <Text style={[styles.status, item.isClaim === true ? styles.statusDone : styles.statusPending]}>
                {item.isClaim === true ? '✅ เคลมแล้ว' : '⏳ รอเคลม'}
            </Text>
        </View>
    );

    return (
        <>
            <BackGroundImage
                components={
                    <>
                        <AppBar
                            title="รายการอะไหล่รอเคลม"
                            replacePath={ROUTE.SPARE_PART}
                        />
                        <View style={styles.container}>
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => `${item.orderId}-${index}`}
                                showsVerticalScrollIndicator={false}
                                
                            />
                        </View>
                    </>
                }/>
            <Loading loading={isLoading} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 120
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#111827',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#374151',
        marginTop: 4,
    },
    value: {
        fontWeight: '500',
        color: '#111827',
    },
    status: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusPending: {
        backgroundColor: '#FEF3C7',
        color: '#B45309',
    },
    statusDone: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
    },
});
export default ClaimPartsScreen;