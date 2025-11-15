import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Loading from '../../components/loading';
import { fetctInformationCloseWork } from '../../services/informationCloseWork';
import styles from './QICloseWorkCss';

type InterfaceProps = {
    orderId: string,
    workType?: string
};

const QICloseWorkPage = (props: InterfaceProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { orderId, workType } = props;
  const [informationCloseWork, setInformationCloseWork] = useState<any>()

  const loadDataAll = async () => {
    setIsLoading(true);
    try {
      const result: any = await fetctInformationCloseWork(orderId, workType);
      console.log('[fetctInformationCloseWork result]', JSON.stringify(result, null, 2));
      if (result.isSuccess) {
        setInformationCloseWork(result.dataResult);
      }
    } catch (error) {
      console.log('error ====>', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataAll();
  }, [props]);

  const Content = () => {
    return (
      <View style={styles.container}>
        <View style={[styles.column]}>
          <Text style={styles.textStyle}>Quality Index</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.textStyle}>{informationCloseWork?.quality_index}</Text>
        </View>
      </View>
    )
  }

  const Contents = () => {
    if(workType === 'inspector') {
      return Content()
    } else if(workType === 'visit') {
      return <View></View>
    } else {
      return Content()
    }
  };

  return (
    <>
      {Contents()}
      <Loading loading={isLoading} />
    </>
  );
};

export default QICloseWorkPage;
