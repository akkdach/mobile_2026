import { StyleProp, TextStyle } from "react-native";

export interface TextInputInterface {
    placeholder?: string;
    value?: any;
    onChangeText?: any;
    placeholderTextColor?: any;
    secureTextEntry?: any;
    useRef?: any;
    keyboardType?: any;
    style?:  StyleProp<TextStyle>;
    keyInput?: any;
    onBlur?: any;
    editable?: boolean,
    maxLength?: any
    onEndEditing?: any
  }
  