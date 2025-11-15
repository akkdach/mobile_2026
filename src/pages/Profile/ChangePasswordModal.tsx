import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Portal, Text, TextInput, Button, HelperText } from 'react-native-paper';
import { ChangePasswordService } from '../../services/profile_service';

 const ChangePasswordModal = ({ visible, onDismiss }:any) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async () => {
    if (!validatePassword(password)) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร รวมตัวพิมพ์ใหญ่ เล็ก ตัวเลข และอักขระพิเศษ');
      return;
    }
    if (password !== confirm) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    setError('');
    // ส่งรหัสผ่านใหม่ไปยัง API หรือระบบ backend
    var result = await ChangePasswordService({newPassword:confirm,password:password});
    if(result.isSuccess){
        Alert.alert(result.message);
        onDismiss(); // ปิด modal
    }else{
        Alert.alert(result.message);
    }
    
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Text style={styles.title}>เปลี่ยนรหัสผ่าน</Text>
        <TextInput
          label="รหัสผ่านใหม่"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          label="ยืนยันรหัสผ่าน"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          style={styles.input}
        />
        {error ? <HelperText type="error">{error}</HelperText> : null}
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          ยืนยัน
        </Button>
        <Button onPress={onDismiss} style={styles.cancel}>
          ยกเลิก
        </Button>
      </Modal>
    </Portal>
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  cancel: {
    marginTop: 4,
  },
});

