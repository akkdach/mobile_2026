import { Icon } from '@ant-design/react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Dimensions,
  TextInput,
} from 'react-native';
import { Modal, Portal, RadioButton, Text } from 'react-native-paper';
import { Fonts } from '../constants/fonts';
import styleSheet from '../components/StyleSheet';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const DropdownSelect = (props: DropdownSelectInterface) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [selects, setValueSelects] = React.useState(props.selects ?? '');
  const [useIcon, setUseIcon] = React.useState(props.isIcon ?? false);
  const [labelText, setLabelText] = React.useState('');
  const maxLimit = props.maxLimit;
  const [selectsItem, setValueSelectsItem] = useState<any>(props.dataItem ?? []);
  const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'))
  const onValueChange = (val: string) => {
    let indexSelect: any;
    let label: any;
    if (props?.dataItem && props?.dataItem?.length > 0) {
      indexSelect = props?.dataItem.findIndex((v: ItemProps) => v.value == val);
      label = props?.dataItem.filter((v: ItemProps) => v.value == val)[0].label;
    }
    if (props.isShowLabel) {
      setValueSelects(`${label}`);
    } else if (props.showValueOnly) {
      setValueSelects(`${val}`);
    } else if (val === label) {
      setValueSelects(`${val}`);
    } else {
      setValueSelects(`${val}:${label}`);
    }
    hideModal();
    if (typeof props.onValueChange == 'function') {
      return props.onValueChange(val, indexSelect, label);
    }
  };

  useEffect(() => {
    if (selects) {
      let data =
        props.dataItem &&
        props.dataItem.filter(
          (val: { value: any; label: any }) => val.value === selects,
        )[0];
      if (data) {
        if (props.isShowLabel) {
          setLabelText(`${data?.label}`);
        } else if (props.showValueOnly) {
          setLabelText(`${data?.value}`);
        } else if (data?.value === data?.label) {
          setLabelText(`${data?.value}`);
        } else {
          setLabelText(`${data?.value}:${data?.label}`);
        }
      } else {
        setLabelText('');
      }
    } else {
      setLabelText('');
    }
  }, []);

  const renderItem = ({ item, index }: any) => {
    return item;
  };

  let listItem: any = [];
  if (selectsItem && selectsItem?.length > 0) {
    selectsItem?.forEach((val:any, index:any) => {
      listItem.push(
        <TouchableOpacity
          onPress={() => onValueChange(val?.value)}
          key={`${props.keyDropdown}-${index}`}>
          <View
            style={{
              flexDirection: 'row',
              padding: 4,
              height: 44,
              marginTop: 8,
              backgroundColor: '#F9F9F9',
              borderRadius: 10,
            }}
            key={index}>
            <View style={{ flex: screenInfo.width > 500 ? 0.2 : 0.4 }}>
              <RadioButton value={val?.value} />
            </View>
            <View style={{ flex: 2 }}>
              <Text
                key={props.keyDropdown}
                style={[
                  {
                    fontFamily: Fonts.Prompt_Medium,
                    fontSize: screenInfo.width > 500 ? 16 : 10 ,
                    marginTop: screenInfo.width > 500 ? 4 : 10,
                  },
                  props.textLabelStyle,
                ]}>
                {val?.label}
              </Text>
            </View>
          </View>
        </TouchableOpacity>,
      );
    });
  }

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
              <Text
                key={props.keyDropdown}
                style={[
                  { fontFamily: Fonts.Prompt_Light, fontSize: 16 },
                  props.textStyle,
                ]}>
                {labelText
                  ? maxLimit && labelText.length > maxLimit
                    ? labelText.substring(0, maxLimit - 3) + '...'
                    : labelText
                  : props.placeholder}
              </Text>
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
          style={[{ paddingLeft: screenInfo.width > 500 ? 60 : 10, paddingRight: screenInfo.width > 500 ? 60 :10 }, props.modelStyle]}
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

          <View style={{ marginTop: 40 }}>
            <TextInput
              style={[styleSheet.input, { height: 42, borderRadius: 10, paddingLeft: 10, fontSize: 16 }]}
              placeholderTextColor={'#FFFFFF'}
              placeholder="Search"
              onChangeText={(textSearch) => {
                if (textSearch) {
                  let data = props.dataItem.filter((item: any) => item?.label?.includes(textSearch))
                  if (data) {
                    setValueSelectsItem(data)
                  }
                } else {
                  setValueSelectsItem(props.dataItem)
                }
              }} />
          </View>
          <RadioButton.Group

            onValueChange={newValue => {
              onValueChange(newValue);
            }}
            key={`radioButton-${props.keyDropdown}`}
            value={selects}>
            <SafeAreaView
              style={[styles.container, props.modelContainer, { marginTop: 20 }]}
              key={props.keyDropdown}>
              <FlatList
                data={listItem}
                initialNumToRender={5}
                renderItem={renderItem}
                keyExtractor={(item, index) => `dropdown-select-list-${index}`}
              />
            </SafeAreaView>
          </RadioButton.Group>
        </Modal>
      </Portal>
    </View>
  );
};

export default DropdownSelect;

const styles = StyleSheet.create({
  container: {
    maxHeight: screenHeight - 250,
  },
});

export interface DropdownSelectInterface {
  test?: any;
  containerStyle?: StyleProp<ViewStyle>;
  dataItem: ItemProps[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  textLabelStyle?: StyleProp<ViewStyle>;
  selects: any;
  textStyle?: StyleProp<TextStyle>;
  containerTextStyle?: StyleProp<ViewStyle>;
  isIcon?: boolean;
  useIcon?: boolean;
  iconName?: any;
  iconColor?: any;
  iconSize?: any;
  iconStyle?: StyleProp<ViewStyle>;
  keyDropdown?: string;
  placeholder?: string;
  maxLimit?: number;
  modelStyle?: StyleProp<ViewStyle>;
  modelContainer?: StyleProp<ViewStyle>;
  onValueChange?: (value: any, index: number, label?: any) => void;
  isShowLabel?: boolean;
  showValueOnly?: boolean;
}

export interface ItemProps {
  label: string;
  value: any;
  parent:string;
}
