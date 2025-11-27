import { Icon } from '@ant-design/react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button, Checkbox, Modal, Portal, Text } from 'react-native-paper';
import { COLOR } from '../constants/Colors';
import { Fonts } from '../constants/fonts';
import styleSheet from '../components/StyleSheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const DropdownSelectMultiple = (props: DropdownSelectMultipleInterface) => {
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [selectsItem, setValueSelectsItem] = useState<
    DropdownSelectMultipleItemProps[]
  >(props.dataItem ?? []);
  const [useIcon, setUseIcon] = React.useState([]);

  const onValueChange = (data: DropdownSelectMultipleItemProps, index: any) => {
    selectsItem[index] = data;
    setValueSelectsItem([...selectsItem]);
    // hideModal();
    if (typeof props.onValueChange == 'function') {
      return props.onValueChange(selectsItem);
    }
  };

  return (
    <View key={`view-${props.keyDropdown}`}>
      <TouchableOpacity
        key={`touchableOpacity-${props.keyDropdown}`}
        activeOpacity={0.9}
        style={[props.containerStyle]}
        onPress={() => {
          showModal();
        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3 }}>
            <View style={[{ paddingTop: 8 }, props.containerTextStyle]}>
              <ScrollView horizontal={true}>
                {selectsItem.some(
                  (val: DropdownSelectMultipleItemProps) => val.checked == true,
                ) ? (
                  selectsItem.map(
                    (val: DropdownSelectMultipleItemProps, index) => {
                      return (
                        <View>
                          {val.checked ? (
                            <View>
                              <Text
                                key={props.keyDropdown}
                                style={[
                                  {
                                    fontFamily: Fonts.Prompt_Light,
                                    fontSize: 16,
                                  },
                                  props.textStyle,
                                ]}>
                                {val.label},
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      );
                    },
                  )
                ) : (
                  <Text
                    key={props.keyDropdown}
                    style={[
                      { fontFamily: Fonts.Prompt_Light, fontSize: 16 },
                      props.textStyle,
                    ]}>
                    {props.placeholder},
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>
          {useIcon && (
            <View style={{ flex: 1 }}>
              <View style={[{ paddingTop: 14 }, props.iconStyle]}>
                <Icon
                  key={props.keyDropdown}
                  name={props.iconName ?? 'down'}
                  size={props.iconSize ?? 14}
                  color={props.iconColor ?? '#FFFFFF'}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Portal key={`portal-${props.keyDropdown}`}>
        <Modal
          key={`modal-${props.keyDropdown}`}
          style={{ paddingLeft: 20, paddingRight: 20 }}
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={
            props.contentContainerStyle
              ? [
                props.contentContainerStyle,
                { backgroundColor: 'white', padding: 20 },
              ]
              : { backgroundColor: 'white', padding: 20 }
          }>
          <View>
            <TextInput
              style={[styleSheet.input]}
              placeholderTextColor={'#FFFFFF'}
              placeholder="Search"
              onChangeText={(textSearch) => {
                if (textSearch) {
                  let data = props.dataItem.filter(item => item.label.includes(textSearch))
                  if (data) {
                    setValueSelectsItem(data)
                  }
                } else {
                  setValueSelectsItem(props.dataItem)
                }
              }} />
          </View>
          <SafeAreaView style={[styles.container, { marginTop: 10 }]} key={props.keyDropdown}>
            <ScrollView key={props.keyDropdown}>
              {selectsItem.map(
                (val: DropdownSelectMultipleItemProps, index) => (
                  <TouchableOpacity onPress={() => {
                    onValueChange(
                      { ...val, ...{ checked: !val.checked } },
                      index,
                    );
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 8,
                      padding: 10,
                      backgroundColor: '#F9F9F9',
                      borderRadius: 50
                    }} key={index}>
                      <View style={{ flex: 0.2 }}>
                        <Checkbox
                          key={index}
                          status={
                            selectsItem[index].checked ? 'checked' : 'unchecked'
                          }
                        />
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text
                          key={props.keyDropdown}
                          style={[
                            {
                              fontFamily: Fonts.Prompt_Medium,
                              fontSize: 18,
                              marginTop: 4,
                            },
                            props.textLabelStyle,
                          ]}>
                          {val?.label}
                        </Text>
                      </View>
                      <View>
                        {selectsItem[index].checked && <Icon name="check-circle" size={30} style={{
                          color: COLOR.primary,
                        }} />}

                      </View>
                    </View>
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
            <View style={{ alignItems: 'center' }}>
              <Button
                style={[styles.btn, { height: 62, width: 350 }]}
                onPress={() => {
                  hideModal();
                }}>
                <Text style={{ color: 'white', fontSize: 18, fontFamily: Fonts.Prompt_Medium }}>ตกลง</Text>
              </Button>
            </View>
          </SafeAreaView>
        </Modal>
      </Portal>
    </View>
  );
};

export default DropdownSelectMultiple;

const styles = StyleSheet.create({
  container: {
    maxHeight: 550,
  },
  btn: {
    width: '100%',
    height: 60,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: COLOR.secondary_primary_color,
    borderRadius: 35,
    marginTop: 20,
  },
});

export interface DropdownSelectMultipleInterface {
  containerStyle?: StyleProp<ViewStyle>;
  dataItem: DropdownSelectMultipleItemProps[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  textLabelStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerTextStyle?: StyleProp<ViewStyle>;
  isIcon?: boolean;
  iconName?: any;
  iconColor?: any;
  iconSize?: any;
  iconStyle?: StyleProp<ViewStyle>;
  keyDropdown?: string;
  placeholder?: string;
  onValueChange?: (value: any) => void;
}

export interface DropdownSelectMultipleItemProps {
  label: string;
  value: any;
  checked: boolean;
  webstatus?: boolean;
}
