import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

type QRScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
};

const QRScannerModal: React.FC<QRScannerModalProps> = ({ visible, onClose, onScanSuccess }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>แสกน QR Code</Text>
          <QRCodeScanner
            onRead={(e) => {
              onScanSuccess(e.data);
              onClose();
            }}
            // flashMode={RNCamera.Constants.FlashMode.auto}
            topContent={<Text style={styles.instruction}>กรุณาเล็งกล้องไปที่ QR Code</Text>}
            bottomContent={
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>ปิด</Text>
              </TouchableOpacity>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default QRScannerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    height: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  instruction: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#555',
  },
  closeButton: {
    padding: 12,
    backgroundColor: '#E53935',
    borderRadius: 8,
    margin: 16,
  },
  closeText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '500',
  },
});