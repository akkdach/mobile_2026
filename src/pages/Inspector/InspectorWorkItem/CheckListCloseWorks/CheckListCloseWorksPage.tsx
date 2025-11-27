import React, { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RadioButton } from "react-native-paper";
import { COLOR } from "../../../../constants/Colors";
import { Fonts } from "../../../../constants/fonts";
import { getCheckListVisitInspectorService, getOperationVisitInspectorMaster } from "../../../../services/work_order_check_list";
import { SafeAreaView } from "react-native-safe-area-context";


type Props = {
  orderId: string;
  workType: string;
};

const CheckListCloseWorksPage = ({ workType, orderId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [valueOperation, setValueOperation] = useState("");
  const [items, setItems] = useState<any>([
    { label: "ปฏิบัติงานในร้านค้าตามขั้นตอนมาตรฐานการทำงาน (WI)", value: "ปฏิบัติงานในร้านค้าตามขั้นตอนมาตรฐานการทำงาน (WI)" },
    { label: "การบำรุงรักษาและSanitation  สำหรับเครื่อง Post - Mix", value: "การบำรุงรักษาและSanitation  สำหรับเครื่อง Post - Mix" },
    { label: "การบำรุงรักษาและSanitation  สำหรับเครื่อง FCB", value: "การบำรุงรักษาและSanitation  สำหรับเครื่อง FCB" },
    { label: "การตรวจสอบคุณภาพเครื่องดื่ม Post - Mix", value: "การตรวจสอบคุณภาพเครื่องดื่ม Post - Mix" },
    { label: "การตรวจสอบคุณภาพเครื่องดื่ม FCB", value: "การตรวจสอบคุณภาพเครื่องดื่ม FCB" },
    { label: "การเก็บตัวอย่างน้ำเพื่อตรวจวิเคราะห์ทางเคมี", value: "การเก็บตัวอย่างน้ำเพื่อตรวจวิเคราะห์ทางเคมี" },
    { label: "การเก็บตัวอย่างเครื่องดื่มและน้ำเพื่อตรวจวิเคราะห์ทางจุลินทรีย์", value: "การเก็บตัวอย่างเครื่องดื่มและน้ำเพื่อตรวจวิเคราะห์ทางจุลินทรีย์" },
    { label: "การ Sanitize ระบบกรองพื้นฐาน", value: "การ Sanitize ระบบกรองพื้นฐาน" },
    { label: "การ Sanitize ระบบกรองพื้นฐาน Everpure", value: "การ Sanitize ระบบกรองพื้นฐาน Everpure" },
    { label: "การบำรุงรักษาและการ Sanitize สำหรับเครื่องทำน้ำแข็งและเครื่องจ่ายน้ำแข็ง", value: "การบำรุงรักษาและการ Sanitize สำหรับเครื่องทำน้ำแข็งและเครื่องจ่ายน้ำแข็ง" },
    { label: "การบำรุงรักษาเครื่องดื่ม Post - Mix แบบ QMP", value: "การบำรุงรักษาเครื่องดื่ม Post - Mix แบบ QMP" },
    { label: "การซ่อมบำรุงอุปกรณ์ Cold Drinks ของ Field Service", value: "การซ่อมบำรุงอุปกรณ์ Cold Drinks ของ Field Service" },
  ]);
  const [checkList, setCheckList] = useState([
    { measure: "", label: "การเเต่งกายเเละความพร้อมของพนักงาน", order: 1, remark: "" },
    { measure: "", label: "การตรวจเช็คความพร้อมของรถก่อนออกปฏิบัติงาน", order: 2, remark: "" },
    { measure: "", label: "การวางแผนการเดินทาง และการโทรนัดหมาย", order: 3, remark: "" },
    { measure: "", label: "มารยาทการขับรถ", order: 4, remark: "" },
    { measure: "", label: "การเเนะนำตัวกับลูกค้าก่อนปฏิบัติงานของช่าง", order: 5, remark: "" },
    { measure: "", label: "", order: 6, remark: "" },
    { measure: "", label: "การอธิบายการใช้อุปกรณ์เเละบำรุงรักษาเบื้องต้น", order: 7, remark: "" },
    { measure: "", label: "การกล่าวลาหลังปฏิบัติงาน", order: 8, remark: "" },
    { measure: "", label: "การควบคุมอะไหล่", order: 9, remark: "" },
    { measure: "", label: "การดูแลเครื่องมือ", order: 10, remark: "" },
    { measure: "", label: "ความสะอาด ความเป็นระเบียบของรถยนต์ (5 ส.)", order: 11, remark: "" }
  ]);

  useEffect(() => {
    getOperationVisitInspector()
    getCheckListVisitInspector()
  }, []);


  const getOperationVisitInspector = async () => {
    try {
      const operationMaster = await getOperationVisitInspectorMaster()
      if (operationMaster) {
        setItems([...operationMaster])
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', `${error?.message}`, [
        {
          text: 'ปิด',
        },
      ]);
    }

  }

  const getCheckListVisitInspector = async () => {
    try {
      const dataResponse = await getCheckListVisitInspectorService(orderId, workType)

      if (dataResponse) {
        if (dataResponse?.checkList.length > 0) {
          setValueOperation(dataResponse?.checkList[5]?.label)
          dataResponse?.checkList.sort(function (a: any, b: any) {
            return a.order - b.order;
          });
          setCheckList(dataResponse?.checkList);
        }
      }
    } catch (error: any) {
      Alert.alert('แจ้งเตือน', `${error?.message}`, [
        {
          text: 'ปิด',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const checkListItem = (title: string, value: string, order: any, index: any) => {
    return (
      <View style={{ flexDirection: 'column', marginTop: 14 }} key={index}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
          <View style={{ flex: 0.2 }}>
            <Text style={{ fontSize: 16, fontFamily: Fonts.Prompt_Light }}>{order}.</Text>
          </View>
          {
            <View style={{ flex: 4 }}>
              <Text style={{ fontSize: 16, fontFamily: Fonts.Prompt_Light }}>{title}</Text>
            </View>}

          <View>
            <Text style={{
              alignItems: 'flex-end',
              fontSize: 16,
              fontFamily: Fonts.Prompt_Light
            }}>
              {value == "1" ? "ปรับปรุง" : value == "2" ? "พอใช้" : value == "3" ? "ดี" : value == "4" ? "ดีมาก" : "-"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View>
            <Text style={{ fontSize: 16, fontFamily: Fonts.Prompt_Light, color: COLOR.primary }}>Remark:</Text>
          </View>
          <View style={{ flex: 0.1 }} ></View>
          <View style={{ flex: 3 }} >
            <Text style={{ fontSize: 16, fontFamily: Fonts.Prompt_Light }}>{checkList[index].remark ? checkList[index].remark : "-"}</Text>

          </View>
        </View>
      </View>)
  }


  const renderWorkOrderList = () => {
    const items: any = [];
    for (let index = 0; index < checkList.length; index++) {
      const { label, measure, order } = checkList[index]
      items.push(checkListItem(label, measure, order, index))
    }

    return items
  }

  return (
    <>
      <SafeAreaView>
        <View>
          <View style={{
            backgroundColor: COLOR.primary,
            padding: 10,
            borderBottomColor: '#F9F9F9',
            borderBottomWidth: 1,
          }}>
            <Text style={{
              color: COLOR.white,
              fontFamily: Fonts.Prompt_Medium,
              fontSize: 24,
            }}>
              Operation Visit
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            {renderWorkOrderList()}
          </View>

        </View>
      </SafeAreaView>
      {/* <Loading loading={loading} /> */}
    </>
  );

}

export default CheckListCloseWorksPage;