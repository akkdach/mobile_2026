import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLOR } from '../../../constants/Colors';

type Props = {
  title?: string;
  type: string;
  workOrderStatus?: string;
  renderImage: (type: string) => React.ReactNode;
  onLaunchCamera: (type: string) => void;
  onLaunchLibrary: (type: string) => void;
};

const ImageCardWidget: React.FC<Props> = memo(
  ({ title, type, workOrderStatus, renderImage, onLaunchCamera, onLaunchLibrary }) => {
    const handleCamera = useCallback(() => onLaunchCamera(type), [type]);
    const handleLibrary = useCallback(() => onLaunchLibrary(type), [type]);

    return (
      <><View style={styles.container}>
        {!!title && <Text style={styles.title}>{title}</Text>}

       <View style={styles.imageContainer}>{renderImage(type)}</View>

        {workOrderStatus !== '4' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btn} onPress={handleCamera}>
              <Icon name="camera" size={30} color={COLOR.white} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.orangeBtn]} onPress={handleLibrary}>
              <Text style={styles.btnText}>เลือกรูป</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </>
    );
  }
);

export default ImageCardWidget;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,

  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.gray,
    marginBottom: 5,
  },
  imageContainer: {
    paddingTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  btn: {
    margin:10,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.primary,
  },
  orangeBtn: {
    backgroundColor: COLOR.orange,
  },
  btnText: {
    color: COLOR.white,
    fontSize: 16,
  },
});