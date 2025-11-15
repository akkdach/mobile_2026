// ProfileScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Card, Avatar } from 'react-native-paper';
import ChangePasswordModal from './ChangePasswordModal';

const user = {
    id: 'xxx',
    username: '91630020',
    fullname: 'อรรคเดช นาราช',
    email: 'user@bevproasia.com',
    mobile: '0',
    role: 'Super',
    wk_ctr: 'BISV003',
    employee_id: '91630020',
    image_url: '', // หากมี URL รูปให้ใส่ตรงนี้
};

const ProfileComponent = () => {
    const [changePasswordVisible, setChangePasswordVisible] = useState<boolean>()
    const {} = useuser
    const handleResetPassword = () => {
        // ใส่ logic สำหรับ reset password ที่นี่
        setChangePasswordVisible(true);
        console.log('Reset password for', user.username);
    };

    return (<>
        <ChangePasswordModal visible={changePasswordVisible} onDismiss={() => (setChangePasswordVisible(false))} />
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={styles.content}>
                    {user.image_url ? (
                        <Image source={{ uri: user.image_url }} style={styles.avatar} />
                    ) : (
                        <Avatar.Text size={80} label={user.fullname.slice(0, 2)} />
                    )}
                    <Text style={styles.name}>{user.fullname}</Text>
                    <Text style={styles.role}>{user.role}</Text>
                    <View style={styles.info}>
                        <Text>Email: {user.email}</Text>
                        <Text>Mobile: {user.mobile}</Text>
                        <Text>Username: {user.username}</Text>
                        <Text>Employee ID: {user.employee_id}</Text>
                        <Text>Work Center: {user.wk_ctr}</Text>
                    </View>
                    <Button mode="contained" onPress={handleResetPassword} style={styles.button}>
                        เปลี่ยนรหัสผ่าน
                    </Button>
                </Card.Content>
            </Card>
        </View>
    </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
    },
    card: {
        borderRadius: 12,
        padding: 16,
    },
    content: {
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    role: {
        fontSize: 16,
        color: '#888',
        marginBottom: 12,
    },
    info: {
        alignSelf: 'stretch',
        marginVertical: 8,
    },
    button: {
        marginTop: 16,
        width: '100%',
    },
});

export default ProfileComponent;