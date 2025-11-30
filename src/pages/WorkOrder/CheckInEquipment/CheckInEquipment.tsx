import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Icon } from '@ant-design/react-native';
import QRScannerModal from './QRScannerModal';
import BackGroundImage from '../../../components/BackGroundImage';
import AppBar from '../../../components/AppBar';
import { fetchCheckOutEquipmentNotMatchGet, fetchCheckOutEquipmentNotMatchSet } from '../../../services/workOrderCheckout';
import AutocompleteCaregiver from './AutocompleteCaregiver';
import CheckBoxIcon from 'react-native-elements/dist/checkbox/CheckBoxIcon';
import DropdownSelect from '../../../components/DropdownSelect';
import { COLOR } from '../../../constants/Colors';
import Loading from '../../../components/loading';
import { StackActions, useNavigation } from '@react-navigation/native';
import { ROUTE } from '../../../constants/RoutePath';
type InterfaceProps = {
    orderId: string,
    type: string
};

const CheckInEquipment = (props: InterfaceProps) => {
    const navigation = useNavigation();
    const [originalEquipment, setOriginalEquipment] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { control, handleSubmit, getValues, setValue } = useForm();
    const [scan, setScan] = useState(false);
    const [valueEquipmentType, setValueEquipmentType] = useState<any>(null);
    const [equipmentType, setEquipmentType] = useState<any>(null);

    const onLoad = async () => {
        var result = await fetchCheckOutEquipmentNotMatchGet(props.orderId);
        if (result.isSuccess) {
            setOriginalEquipment(result.dataResult);
            setValueEquipmentType(result.dataResult.equipmentType ?? result.dataResult.originalEquipmentType);
            setValue('equipment', result.dataResult?.equipment);
            setValue('comment', result.dataResult?.comment);
        }
    }
    const onSubmit = async (data: any) => {
        var equipment = getValues('equipment');
        if (!equipment) { Alert.alert('โปรดระบุหมายเลขเครื่อง'); return; }
        if (!valueEquipmentType) { Alert.alert('โปรดระบุประเภทเครื่อง'); return; }
        if (!props.orderId) { Alert.alert('โปรดระบุออเดอร์'); return; }

        setIsLoading(true)
        var result = await fetchCheckOutEquipmentNotMatchSet({
            ...data,
            workOrder: props.orderId,
            equipmentType: valueEquipmentType,

        });
        setIsLoading(false);
        if (result.isSuccess) {
            Alert.alert('ดำเนินการสำเร็จ');
            navigation.dispatch(StackActions.pop())
        } else {
            Alert.alert(result.message)
        }
    };


    useEffect(() => {
        onLoad();
        const typeStr = props.type.substr(0, 2);
        if (typeStr === 'ZC') {
            setEquipmentType([
                { label: 'TBIB', value: 'TBIB' },
                { label: 'TCO', value: 'TCO' },
                { label: 'TFCB', value: 'TFCB' },
                { label: 'TICM', value: 'TICM' },
                { label: 'TIDP', value: 'TIDP' },
                { label: 'TPX', value: 'TPX' },
                { label: 'TVCA', value: 'TVCA' },
                { label: 'TVEN', value: 'TVEN' },
                { label: 'TVTE', value: 'TVTE' },
            ]);
        }

        if (typeStr === 'BN') {
            setEquipmentType([
                { label: 'NPX', value: 'NPX' },
                { label: 'NFCB', value: 'NFCB' },
                { label: 'NBIB', value: 'NBIB' },
                { label: 'NHOT', value: 'NHOT' },
                { label: 'NCOLD', value: 'NCOLD' },
                { label: 'NPSO', value: 'NPSO' },
                { label: 'NIARP', value: 'NIARP' },
            ]);
        }
    }, []);

    const ContentOriginalEquipmentInformation = (props: any) => {
        return (
            <>
                <View style={styles.container}>
                    <Text style={styles.label}>🔧 หมายเลขเครื่องที่แจ้ง : {originalEquipment?.originalEquipment}</Text>
                    <Text style={styles.label}>📦 ประเภทเครื่องที่แจ้ง : {originalEquipment.originalEquipmentType}</Text>
                    <Text style={styles.label}>⚙️ โมเดลเครื่องที่แจ้ง : {originalEquipment?.model}</Text>
                </View>
            </>
        );
    };


    const Contents = (props: any) => {
        return <>
            <QRScannerModal visible={scan} onClose={() => setScan(false)} onScanSuccess={(data: any) => {
                setValue('equipment', data);
            }} />
            {originalEquipment && <ContentOriginalEquipmentInformation />}
            <View style={styles.container}>
                <Text style={styles.label}>หมายเลขเครื่องที่พบ</Text>
                <View style={styles.inputWithIcon}>
                    <Controller
                        control={control}
                        name="equipment"
                        defaultValue=""

                        render={({ field: { onChange, value } }) => (
                            <TextInput

                                style={styles.input}
                                placeholder="กรอกหมายเลขหรือแสกน"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    <TouchableOpacity style={styles.iconButton} onPress={() => {/* เปิดกล้องแสกน QR */ }}>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Icon
                                name="qrcode"
                                size={40}
                                style={{ paddingRight: 1, paddingLeft: 1 }}
                                color="#000000"
                                onPress={() => setScan(true)}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <>
                    <Text style={styles.label}>Service Object Type</Text>
                    <DropdownSelect
                        selects={valueEquipmentType}
                        dataItem={equipmentType}
                        placeholder={'ประเภทเครื่อง'}
                        textStyle={{
                            color: COLOR.white,
                            fontSize: 18,
                            marginTop: -4,
                        }}
                        containerStyle={{
                            backgroundColor: 'rgba(0, 172, 200, 0.6)',
                            width: '100%',
                            height: 52,
                            borderRadius: 5,
                            paddingTop: 8,
                            marginTop: 10,
                            alignItems: 'flex-start',
                            paddingLeft: 40,
                        }}
                        iconStyle={{ paddingTop: 18, paddingLeft: 120 }}
                        isIcon={true}
                        iconSize={20}
                        contentContainerStyle={{ borderRadius: 10 }}
                        onValueChange={val => {
                            setValueEquipmentType(val);
                        }}
                        isShowLabel={true}
                    />
                </>

                <Text style={styles.label}>หมายเหตุ</Text>
                <Controller
                    control={control}
                    name="comment"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="รายละเอียดเพิ่มเติม"
                            value={value}
                            onChangeText={onChange}
                            multiline
                        />
                    )}
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.buttonText}>ยืนยัน</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => {
                        navigation.dispatch(StackActions.push(ROUTE.MainCheckIn, props))
                    }}>
                        <Text style={styles.buttonText}>ยกเลิก</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </>
    }

    return (
        <>
            <AppBar title="เช็คอินเครื่อง"></AppBar>
            <BackGroundImage
                components={<Animated.ScrollView>{Contents(props)}</Animated.ScrollView>}
            />
            <Loading loading={isLoading} />

        </>
    );
}
export default CheckInEquipment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FAFAFA',
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#333',
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 16,
        color:'#000'
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 8,
        padding: 8,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        marginRight: 8,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F44336',
        padding: 14,
        borderRadius: 8,
        marginLeft: 8,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: '600',
    }, inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        color: '#333',
        backgroundColor: '#FFF',
        marginBottom: 16,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        color: '#333',
        backgroundColor: '#FFF',
        marginBottom: 16,
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
    },
    icon: {
        marginRight: '8px',
        fontSize: 20,
    },
    value: {
        color: '#333',
    },
});