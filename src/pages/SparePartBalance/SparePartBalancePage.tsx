import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Dimensions, ImageBackground, View } from 'react-native';
import AppBar from '../../components/AppBar';
import Loading from '../../components/loading';
import SparePartBalanceList from '../../components/SparePart/SparePartBalanceList';
import TextInputComponent from '../../components/TextInput';
import { ISparePartRemainingItem } from '../../models';
import { fetchSparePartRemaining, SynSpareBalance } from '../../services/sparePart';
import { FullArrayTextSearch } from '../../utils/FullTextSearch';
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import { Button, Text } from 'react-native-paper';
import { COLOR } from '../../constants/Colors';
import { Fonts } from '../../constants/fonts';

type Inputs = {
  searchSparePart: string;
};

const screenHeight = Dimensions.get('window').height;

const SparePartBalancePage: React.FC = (props: any) => {
  const { profile } = props.route.params;
  const { control, watch } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [sparePartBalance, setSparePartBalance] = useState<
    ISparePartRemainingItem[] | unknown
  >([]);
  const [sparePartBalanceMaster, setSparePartBalanceMaster] = useState<
    ISparePartRemainingItem[] | unknown
  >([]);
  const [filterSparePart, setFilterSparePart] = useState<
    { label: string; value: string }[]
  >([]);

  watch(observe => {
    if (observe.searchSparePart && observe.searchSparePart.length > 3) {
      const filterFullText = FullArrayTextSearch(
        sparePartBalanceMaster as ISparePartRemainingItem[],
        observe.searchSparePart,
      );
      setSparePartBalance(filterFullText);
    } else {
      setSparePartBalance(sparePartBalanceMaster);
    }
  });

  const fetchSparePartBalance = async () => {
    setIsLoading(true);
    try {
      const result = await fetchSparePartRemaining();
      const sparePartBalanceResponse: ISparePartRemainingItem[] | unknown =
        result.dataResult?.sparepartList as ISparePartRemainingItem[];
      setSparePartBalance(sparePartBalanceResponse);
      setSparePartBalanceMaster(sparePartBalanceResponse);
      setFilterSparePart(
        (sparePartBalanceResponse as ISparePartRemainingItem[]).map(val => {
          return {
            label: `${val.material}: ${val.materialDescription}`,
            value: val.material,
          };
        }),
      );
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSparePartBalance();
  }, []);

  const handleSyn = async () => {
    setIsLoading(true);
    var result = await SynSpareBalance();
    setIsLoading(false);
    if(result?.isSuccess){
      fetchSparePartBalance();
    }else{
      Alert.alert(result?.message ?? 'เกิดข้อผิดพลาดที่ไม่รู้จัก')
    }
  }
  const Search = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{ flex: 2 , padding: 10}}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={{ height: 52 }}
                onChangeText={(value: any) => onChange(value)}
              />
            )}
            name="searchSparePart"
            defaultValue=""
          />
        </View>
      </View>
    );
  };
  return (
    <>
      {ScreenWidth > 1 ? <AppBar
        title="อะไหล่คงเหลือ"
        rightTitle={`Work Center: ${profile.wk_ctr}`}></AppBar> :
        <AppBar
          title="อะไหล่คงเหลือ"
          rightTitle={`WC: ${profile.wk_ctr}`}></AppBar>
      }
      <ImageBackground
        key={'ImageBackground'}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../../assets/images/bg.png')}>
        {Search()}
        <View
          style={{ paddingLeft: 0, paddingRight: 5, height: screenHeight - 290 }}>
          <SparePartBalanceList
            sparePartBalances={sparePartBalance as ISparePartRemainingItem[]}
          />
        </View>
        {/* <View style={{ width: '100%',alignItems:'center',bottom:70,position:'absolute' }}>
            <Button
              onPress={handleSyn}
              style={{
                backgroundColor: COLOR.primary,
                width: 152,
                borderRadius: 50,
                
              }}>
              <Text
                style={{
                  fontFamily: Fonts.Prompt_Medium,
                  fontSize: 20,
                  color: COLOR.white,
                }}>
                อัปเดทยอด
              </Text>
            </Button>
          </View> */}
      </ImageBackground>
      <Loading loading={isLoading} />
    </>
  );
};

export default SparePartBalancePage;
