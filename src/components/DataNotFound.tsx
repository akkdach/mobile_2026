import React from "react";
import { Image, Text, View } from "react-native";
import { COLOR } from "../constants/Colors";
import { Fonts } from "../constants/fonts";
import { generateKey } from "../utils/Random";
const icon = require('../../assets/images/data_not_found.png');


interface Props {
    loading: any;
    paddingTop?: any
}

const DataNotFound = () => {
    return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center',
        }}>
            <Image
                style={{ width: 180, height: 180 }}
                source={icon}
                key={`${generateKey('icon-img')}`}
            />
            <Text style={{
                fontFamily: Fonts.Prompt_Medium,
                color: COLOR.gray,
                fontSize: 18
            }}>
                ไม่พบรายการ
            </Text>
        </View>
    )
}


export default DataNotFound;