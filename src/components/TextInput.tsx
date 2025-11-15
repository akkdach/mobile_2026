import React from 'react';
import {TextInput, View} from 'react-native';
import {TextInputInterface} from '../models';
import styleSheet from '../components/StyleSheet';

const TextInputComponent = (props: TextInputInterface) => {
  return (
    <View style={[{padding: 1}]}>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={'#FFFFFF'}
        ref={props.useRef}
        secureTextEntry={props.secureTextEntry}
        style={[styleSheet.input, props.style]}
        keyboardType={props.keyboardType}
        key={props.keyInput}
        onBlur={props.onBlur}
        onEndEditing= {props.onEndEditing}
        maxLength= {props.maxLength}
        editable = {props.editable}
      />
    </View>
  );
};

export default TextInputComponent;
