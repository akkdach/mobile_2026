
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Loading from '../../../components/loading';
import { COLOR } from '../../../constants/Colors';
import { getCheckListCodeDefectMaster, getCheckListService } from "../../../services/work_order_check_list";
import styles from './WorkOrderQlChecklistCloseWorkCss';
type InterfaceProps = {
    backReloadPage: boolean;
    orderId: string;
    type: string;
    workCenter: string;
    objType: string;
    orderTypeDescription: string;
    webStatus: string
};

const WorkOrderQlChecklistCloseWork = (props: { workOrderData: InterfaceProps }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workOrderQICheckList, setWorkOrderQICheckList] = useState<any>()
    const windowWidth = Dimensions.get('window').width;
    useEffect(() => {
        getCheckList();
        let timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);
        return () => {
            clearTimeout(timer);
        };
    }, []);


    const getCheckList = async () => {
        setIsLoading(true);
        try {
            let defectMaster = await getCheckListCodeDefectMaster();
            let response = await getCheckListService(props.workOrderData.orderId);
            if (response) {
                let dataTitle = []
                for (const key in response) {
                    if (Object.prototype.hasOwnProperty.call(response, key)) {
                        const dataObject = response[key]
                        const dataItem = response[key].items;
                        let dataListDefect = []
                        if (dataItem) {
                            for (let index = 0; index < dataItem.length; index++) {
                                const item = dataItem[index];
                                if (item["type"] == "radio") {
                                    if (item["measure"] == "false" && item["codeDescription"] != "") {
                                        let data = defectMaster[dataObject?.type].filter((v: any) => v.value == item["codeDescription"])
                                        if (data) {
                                            data = {...data[0], ...{title: item["title"]}}
                                            dataListDefect.push(data)
                                        }
                                    }
                                }
                            }
                            delete dataObject["items"]
                            dataTitle.push({ ...dataObject, ...{ defect: dataListDefect } })

                        }

                    }

                }
                setWorkOrderQICheckList(dataTitle);
                console.log("[defectMaster]===========+++>", JSON.stringify(dataTitle, null, 2))
            }

            // console.log("[response]===========+++>", JSON.stringify(response, null, 2))
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const Header = () => {
        return (
          <View style={[styles.header, { display: 'flex' }]}>
               <View style={styles.container}>
                    <View style={[styles.column, { width: '50%' }]}>
                        <Text style={ styles.collapsibleTitle }>{`รายการตรวจเช็คอุปกรณ์`}</Text>
                    </View>
                    <View style={[styles.column, { width: '10%' }]}>
                        <Text style={ styles.collapsibleTitle }>{``}</Text>
                    </View>
                    <View style={[styles.column, { width: '40%' }]}>
                    <Text style={ styles.collapsibleTitle }>{`Remark`}</Text>
                    </View>
               </View>
           
            
           
          </View>
        );
      }

    return (
        <>
            {Header()}
            <View>
                <View style={{ backgroundColor: '#fff' }}>
                    {
                        workOrderQICheckList?.map((list: any, index:any) => {
                            return (
                                <View style={styles.column} key={index}>
                                    <View style={{  }}>
                                        <View style={[styles.box,styles.line_bottom, { backgroundColor: '#98FB98', borderRightWidth: 0 }]}><Text style={[styles.textStyle]}>{list.title}</Text></View>
                                    </View>
                                    <View>
                                        {list.defect.length > 0 ?
                                            list.defect.map((defect: any, idx:any) => {
                                                return (
                                                    <View style={[styles.column, styles.line_bottom,]} key={`${index}-${idx}`}>
                                                        <View style={[styles.container]}>
                                                            <View style={{ flex: 2 }}>
                                                                <View style={[styles.box]}>
                                                                    <Text style={[styles.textStyle, { color: 'red' }]}>{defect.title}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flex: 0.5 }}>
                                                                <View style={styles.box}>
                                                                    <Text style={[styles.textStyle, { color: 'red', textAlign: 'center' }]}>{'X'}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={{ flex: 2 }}>
                                                                <View style={styles.box}>
                                                                    <Text style={styles.textStyle}>{defect?.label}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>)
                                            })

                                            : <View></View>}
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
            {/* <View>
                <View style={{ backgroundColor: '#fff' }}>
                    {
                        workOrderQICheckList?.map((list: any) => {
                            return (
                                <View style={styles.container}>
                                    <View style={[styles.column, { width: '50%'}]}>
                                        <View style={[styles.box, {backgroundColor: '#98FB98', borderRightWidth: 0} ]}><Text style={[styles.textStyle]}>{list.title}</Text></View>
                                        {
                                            list.defect.length > 0 ? (
                                                list.defect.map((defect: any) => {
                                                    return (
                                                        <View style={[styles.box]}><Text style={[styles.textStyle, { color: 'red' }]}>{defect.title}</Text></View>
                                                    )
                                                })
                                            ) : <View></View>
                                        }
                                        
                                    </View>
                                    <View style={[styles.column, { width: '5%', justifyContent: 'center' }]}>
                                        <View style={[styles.box, {backgroundColor: '#98FB98', borderRightWidth: 0}]}><Text style={styles.textStyle}>{''}</Text></View>
                                        {
                                            list.defect.length > 0 ? list.defect.map((defect: any) => {
                                                return (
                                                    <View style={styles.box}>
                                                        <Text style={[styles.textStyle, { color: 'red', textAlign: 'center' }]}>{'X'}</Text>
                                                    </View>
                                                   
                                                )
                                            }) :  <View></View>
                                        }
                                    </View>
                                    <View style={[styles.column, { width: '45%'}]}>
                                        <View style={[styles.box, {backgroundColor: '#98FB98', borderRightWidth: 0}]}><Text style={styles.textStyle}>{''}</Text></View>
                                        {
                                            list.defect.length > 0 ? list.defect.map((defect: any) => {
                                                return (
                                                    <View style={styles.box}>
                                                        <Text style={[styles.textStyle]}>{defect.label}</Text>
                                                    </View>
                                                   
                                                )
                                            }) : <View></View>
                                        }
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View> */}
            <Loading loading={isLoading} />
        </>
    );
}

export default WorkOrderQlChecklistCloseWork;