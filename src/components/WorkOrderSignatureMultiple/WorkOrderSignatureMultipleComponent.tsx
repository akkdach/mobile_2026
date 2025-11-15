import { Icon, Modal } from "@ant-design/react-native";
import React, { createRef } from "react";
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import SignatureCapture from "react-native-signature-capture";
import { Fonts } from "../../constants/fonts";
import * as RNFS from 'react-native-fs';

const WorkOrderSignatureMultipleComponent = ({title, type, saveImageSign, visibleModal, setStateVisibleModal}: any) => {
    const sign = createRef<any>();
    const saveSign = () => {
        sign.current.saveImage();
      };
    
      const resetSign = () => {
        sign.current.resetImage();
      };
    
    const _onSaveEvent = async (result: any, type: string) => {
        const temp = {
            name: 'cacheimage.jpg',
            type: 'image/jpeg',
            base64Url: result.encoded
        }
        // console.log('_onSaveEvent', temp)
        saveImageSign(temp, type)
        setStateVisibleModal(type)
    }

    const _onDragEvent = () => {
         // This callback will be called when the user enters signature
        console.log("dragged");
    }

    return (
        <Modal
        transparent
        maskClosable
        style={{ width: 800, height: 800, borderRadius: 15 }}
        visible={visibleModal}>
            <ScrollView>
                <View style={{ alignItems: 'flex-end' }}>
                    <TouchableHighlight underlayColor="#fff" onPress={() => { setStateVisibleModal(type) }}>
                        <Icon name="close" size={30} />
                    </TouchableHighlight>
                </View>
                <View style={styles.container}>
                    <Text style={styles.signTextStyle}>
                        {title}
                    </Text>
                    <SignatureCapture
                        style={styles.signature}
                        ref={sign}
                        onSaveEvent={(result) => _onSaveEvent(result, type)}
                        onDragEvent={_onDragEvent}
                        showNativeButtons={false}
                        showTitleLabel={false}
                        viewMode={'portrait'}
                    />
                
                    <View style={{flexDirection: 'row'}}>
                        <TouchableHighlight
                            style={styles.buttonStyle}
                            onPress={() => {
                                saveSign();
                            }}>
                            <Text>ตกลง</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.buttonStyle}
                            onPress={() => {
                                resetSign();
                            }}>
                            <Text>เซ็นใหม่</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    signTextStyle: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        textDecorationLine: 'underline',
        fontFamily: Fonts.Prompt_Medium,
    },
    container: {
        // flex: 1,
        backgroundColor: 'white',
        height: 700,
        width: '100%',
        padding: 30,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#eeeeee',
        margin: 10,
    },
})

export default WorkOrderSignatureMultipleComponent