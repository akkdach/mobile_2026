import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Dimensions, ImageBackground, View} from 'react-native';
import AppBar from '../../../components/AppBar';
import Loading from '../../../components/loading';
import TextInputComponent from '../../../components/TextInput';
import ToolsBalanceList from '../../../components/Tools/ToolsBalanceList';
import {IToolsRemainingItem} from '../../../models';
import {fetchRemainingTools} from '../../../services/sparePart';
import {FullArrayTextSearch} from '../../../utils/FullTextSearch';

type Inputs = {
  searchTools: string;
};

const screenHeight = Dimensions.get('window').height;

const ToolsBalancePage: React.FC = (props: any) => {
  const {control, watch} = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [toolsBalance, setToolsBalance] = useState<
    IToolsRemainingItem[] | unknown
  >([]);
  const [toolsBalanceMaster, setToolsBalanceMaster] = useState<
    IToolsRemainingItem[] | unknown
  >([]);
  const [filterTools, setFilterTools] = useState<
    {label: string; value: string}[]
  >([]);

  watch(observe => {
    if (observe.searchTools && observe.searchTools.length > 3) {
      const filterFullText = FullArrayTextSearch(
        toolsBalanceMaster as IToolsRemainingItem[],
        observe.searchTools,
      );
      setToolsBalance(filterFullText);
    } else {
      setToolsBalance(toolsBalanceMaster);
    }
  });

  const fetchToolsBalance = async () => {
    setIsLoading(true);
    try {
      const result = await fetchRemainingTools();
      const toolsBalanceResponse: IToolsRemainingItem[] | unknown = result
        .dataResult?.sparepartList as IToolsRemainingItem[];
      setToolsBalance(toolsBalanceResponse);
      setToolsBalanceMaster(toolsBalanceResponse);
      setFilterTools(
        (toolsBalanceResponse as IToolsRemainingItem[]).map(val => {
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
    fetchToolsBalance();
  }, []);

  const Search = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{flex: 2,padding: 10}}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInputComponent
                placeholder="ค้นหา"
                value={value}
                style={{height: 52}}
                onChangeText={(value: any) => onChange(value)}
              />
            )}
            name="searchTools"
            defaultValue=""
          />
        </View>
      </View>
    );
  };
  return (
    <>
      <AppBar
        title="เครื่องมือคงเหลือ"
        rightTitle={`Work Center: ${props.profile.wk_ctr}`}></AppBar>
      <ImageBackground
        key={'ImageBackground'}
        style={{
          width: '100%',
          height: '100%',
        }}
        source={require('../../../../assets/images/bg.png')}>
        {Search()}
        <View
          style={{paddingLeft: 5, paddingRight: 5, height: screenHeight - 260}}>
          <ToolsBalanceList
            toolsBalances={toolsBalance as IToolsRemainingItem[]}
          />
        </View>
      </ImageBackground>
      <Loading loading={isLoading} />
    </>
  );
};

export default ToolsBalancePage;
