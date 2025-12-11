import { Provider } from '@ant-design/react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppMain from './AppMain';
import { ROUTE } from './constants/RoutePath';
import DownloadPage from './pages/Download/DownloadPage';
import InspectorPage from './pages/Inspector/InspectorPage';
import InspectorWorkItemPage from './pages/Inspector/InspectorWorkItem/InspectorWorkItemPage';
import LandingPage from './pages/LandingPage';
import LearningCenterPage from './pages/LearningCanter/LearningCenterPage';
/* Page */
import LoginPage from './pages/LoginPage';
import MainMenuPage from './pages/MainMenuPage';
import ManagementPlanResourcePage from './pages/ManagementPlanResource/ManagementPlanResource';
import NotificationDetail from './pages/Notification/NotificationDetail';
import NotificationPage from './pages/Notification/NotificationPage';
import ProfilePage from './pages/Profile/ProfilePage';
import QualityIndex from './pages/QualityIndex/QualityIndex';
import ReportPage from './pages/Report/ReportPage';
import SparePartPage from './pages/SparePart/SparePartPage';
import SparePartBalancePage from './pages/SparePartBalance/SparePartBalancePage';
import SparePartVanCheckPage from './pages/SparePartVanCheck/SparePartVanCheckPage';
import StartWorkPage from './pages/StartWork/StartWorkPage';
import ToolRemainPage from './pages/Tools/ToolRemain/ToolRamain';
import ToolsPage from './pages/Tools/ToolsPage';
import VisitPage from './pages/Visits/VisitsPage';
import VisitSettingWorkOrderPage from './pages/Visits_Setting/Visits_Setting';
import WorklistPage from './pages/Worklist/WorklistPage';
import SatisfactionAssessmentFormPage from './pages/WorkOrder/SatisfactionAssessmentForm/SatisfactionAssessmentForm';
import WorkOrderCameraPage from './pages/WorkOrder/WorkOrderCamera/WorkOrderCamera';
import WorkOrderCCPCheck from './pages/WorkOrder/WorkOrderCCPCheck/WorkOrderCCPCheck';
import WorkOrderConnectivityPage from './pages/WorkOrder/WorkOrderConnectivity/WorkOrderConnectivity';
import WorkOrderDetailsWorkPage from './pages/WorkOrder/WorkOrderDetailsWork/WorkOrderDetailsWork';
import WorkOrderDetailsPage from './pages/WorkOrder/WorkOrderDetalis/WorkOrderDetalis';
import WorkOrderDeviceNumberPage from './pages/WorkOrder/WorkOrderDeviceNumber/WorkOrderDeviceNumberPage';
import WorkOrderHistoryPage from './pages/WorkOrder/WorkOrderHistory/WorkOrderHistory';
import WorkOrderListPage from './pages/WorkOrder/WorkOrderList/WorkOrderList';
import WorkOrderMapsPage from './pages/WorkOrder/WorkOrderMaps/WorkOrderMaps';
import WorkOrderPage from './pages/WorkOrder/WorkOrderPage';
import WorkOrderPmCheckListPage from './pages/WorkOrder/WorkOrderPmCheckList/WorkOrderPmCheckList';
import WorkOrderProblemIssuePage from './pages/WorkOrder/WorkOrderProblemIssue/WorkOrderProblemIssue';
import WorkQlChecklist from './pages/WorkOrder/WorkOrderQlChecklist/WorkOrderQlChecklist';
import WorkOrderSignature from './pages/WorkOrder/WorkOrderSignature/WorkOrderSignature';
import WorkOrderAddSparePartsPage from './pages/WorkOrder/WorkOrderSparePartsList/WorkOrderAddSpareParts';
import WorkOrderSparePartsListPage from './pages/WorkOrder/WorkOrderSparePartsList/WorkOrderSparePartsList';
import WorkProcedurePage from './pages/WorkOrder/WorkProcedure/WorkProcedure';
import WorkStatusPage from './pages/WorkOrder/WorkStatus/WorkStatus';
import WorkProcessPage from './pages/WorkProcess/WorkProcessPage';
import { DrawerProvider } from './reducer/DrawerProvider';
import SparePartOutstandingPage from './pages/SparePartOutstanding/SparePartOutstandingPage';
import WorkProcedureMultiple from './components/WorkProcedureMultiple/WorkProcedureMultiple';
import ApproveWorklistPage from './pages/Worklist/ApproveWorklist/ApproveWorklistPage';
import SatisfactionAssessmentFormMultiplePage from './components/SatisfactionAssessmentFormMultiple/SatisfactionAssessmentFormMultiple';
import WorkOrderSignatureMultiple from './components/WorkOrderSignatureMultiple/WorkOrderSignatureMultiple';
import SparePartStoreTransferPage from './pages/SparePartStoreTransfer/SparePartStoreTransferPage';
import SparePartStoreTransferCheckPage from './pages/SparePartStoreTransfer/SparePartStoreTransferCheckPage';
import SparePartRequestTransferPage from './pages/SparePartRequestTransfer/SparePartRequestTransferPage';
import SparePartAddRequestTransferPage from './pages/SparePartRequestTransfer/SparePartAddRequestTransfer';
import SparePartTransferPage from './pages/SparePartTransfer/SparePartTransfer';
import SparePartVanCheckListPage from './pages/SparePartVanCheck/SparePartVanCheckListPage';
import KnowledgePage from './pages/LearningCanter/Knowledge/KnowlegdePage';
import ToolsBalancePage from './pages/Tools/ToolBalance/ToolBalancePage';
import KnowledgePreviewPage from './pages/LearningCanter/Knowledge/KnowlegdePreviewPage';
import ToolRequestTransferPage from './pages/Tools/ToolRequestTransfer/ToolRequestTransferPage';
import ToolAddRequestTransferPage from './pages/Tools/ToolRequestTransfer/ToolAddRequestTransferPage';
import ToolTransferPage from './pages/Tools/ToolTransfer/ToolTransfer';
import ToolVanCheckPage from './pages/Tools/ToolVanCheck/ToolVanCheckPage';
import ToolStoreTransferPage from './pages/Tools/ToolStoreTransfer/ToolStoreTransferPage';
import InspectorWorkOrderDetailsWorkPage from './pages/Inspector/InspectorWorkItem/InspectorWorkOrderDetailsWorkPage';
import InspectorWorkOrderQualityIndexPage from './pages/Inspector/InspectorWorkItem/InspectorWorkOrderQualityIndexPage';
import InspectorWorkOrderCheckListPage from './pages/Inspector/InspectorWorkItem/CheckList/InspectorWorkOrderCheckListPage';
import InspectorSatisfactionAssessmentFormPage from './pages/Inspector/InspectorWorkItem/InspectorSatisfactionAssessmentForm';
import InspectorWorkOrderSignature from './pages/Inspector/InspectorWorkItem/InspectorWorkOrderSignature';
import CheckListVisitInspectorPage from './pages/Inspector/InspectorWorkItem/CheckListVisitInspector/checkListVisitInspector';
import ToolStoreTransferCheckPage from './pages/Tools/ToolStoreTransfer/ToolStoreTransferCheckPage';
import WorkOrderImagesOtherPage from './pages/WorkOrder/WorkOrderImageOther/WorkOrderImageOtherPage';
import ImageOtherProvider from './context/imageContext';
import ApproveOTPage from './pages/Worklist/ApproveOT/ApproveOTPage';
import SparePartCheckPage from './pages/SparePartCheck/SparePartCheckPage';
import WorkImagePage from './pages/WorkOrder/WorkImage/WorkImage';
import SparePartRequestTransferApprovePage from './pages/SparePartRequestTransferApprove/SparePartRequestTransferApprovePage';
// import SparePartRequestTransferWiteApprovePage from './pages/SparePartRequestTransferWiteApprove/SparePartRequestTransferWiteApprovePage';
import SparePartRequestTransferWiteApprove from './pages/SparePartRequestTransferVanWiteApprove/SparePartRequestTransferWiteApprovePage';
import SparePartRequestTransferVanPage from './pages/SparePartRequestTransferVAN/SparePartRequestTransferVanPage';
import SparePartAddRequestTransferVan from './pages/SparePartRequestTransferVAN/SparePartAddRequestTransferVan';
import ClaimPartsScreen from './pages/ClaimPartsScreen/ClaimPartsScreen';
import MainCheckIn from './pages/WorkOrder/MainCheckIn/MainCheckIn';
import CheckInEquipment from './pages/WorkOrder/CheckInEquipment/CheckInEquipment';
import QualityIndexNonCSD from './pages/QualityIndexNonCSD/QualityIndexNonCSD';
import RecommendPartsScreen from './pages/WorkOrder/ReccommendPart/RecommendPartsScreen';

const RoutingPage = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <DrawerProvider>
        <Provider>
          <ImageOtherProvider>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false
                }}>
                <Stack.Screen
                  component={LandingPage}
                  name="landing"
                />
                <Stack.Screen component={LoginPage} name="login" />
                <Stack.Screen component={AppMain} name="appMain" />
                <Stack.Screen
                  component={MainMenuPage}
                  name="mainMenu"
                />
                <Stack.Screen
                  component={StartWorkPage}
                  name="startWork"
                />
                <Stack.Screen
                  component={QualityIndex}
                  name="qualityIndex"
                />
                <Stack.Screen
                  component={WorkOrderDetailsWorkPage}
                  name="workOrderDetailsWork"
                />
                <Stack.Screen
                  component={WorkOrderPage}
                  name="workorder"
                />
                <Stack.Screen
                  component={WorkOrderListPage}
                  name="workOrderList"
                />
                <Stack.Screen
                  component={SparePartOutstandingPage}
                  name="sparepartOutstanding"
                />
                <Stack.Screen
                  component={WorklistPage}
                  name="worklist"
                />
                <Stack.Screen
                  component={VisitPage}
                  name="visit"
                />
                <Stack.Screen
                  component={WorkOrderConnectivityPage}
                  name="workOrderConnectivity"
                />
                <Stack.Screen
                  component={InspectorPage}
                  name="inspector"
                />
                <Stack.Screen
                  key="inspectorWorkItem"
                  component={InspectorWorkItemPage}
                  name="inspectorWorkItem"
                />
                <Stack.Screen
                  component={InspectorWorkOrderDetailsWorkPage}
                  name={ROUTE.INSPECTOR_WORK_ORDER_DETAILS}
                />
                <Stack.Screen
                  component={InspectorWorkOrderQualityIndexPage}
                  name={ROUTE.INSPECTOR_WORK_ORDER_QUALITY_INDEX}
                />
                <Stack.Screen
                  component={InspectorWorkOrderCheckListPage}
                  name={ROUTE.INSPECTOR_WORK_ORDER_CHECK_LIST}
                />
                <Stack.Screen
                  component={InspectorSatisfactionAssessmentFormPage}
                  name={ROUTE.INSPECTOR_SATISFACTION_ASSESSMENT_FORM}
                />
                <Stack.Screen
                  component={InspectorWorkOrderSignature}
                  name="inspectorWorkOrderSignature"
                />
                <Stack.Screen
                  component={ProfilePage}
                  name="profile"
                />
                <Stack.Screen
                  component={SatisfactionAssessmentFormPage}
                  name="assessmentForm"
                />
                <Stack.Screen
                  component={WorkOrderSignature}
                  name="workSignature"
                />
                <Stack.Screen
                  component={WorkOrderCameraPage}
                  name="workCamera"
                />
                <Stack.Screen
                  component={WorkImagePage}
                  name="workImage"
                />
                <Stack.Screen
                  component={WorkOrderDetailsPage}
                  name="workOrderDetails"
                />
                <Stack.Screen
                  component={WorkOrderHistoryPage}
                  name="workOrderHistory"
                />
                <Stack.Screen
                  component={WorkOrderMapsPage}
                  name="workOrderMaps"
                />
                <Stack.Screen
                  component={WorkOrderPmCheckListPage}
                  name="workOrderPmCheckList"
                />
                <Stack.Screen
                  component={WorkOrderCCPCheck}
                  name="workOrderCCPCheck"
                />
                <Stack.Screen
                  component={WorkOrderProblemIssuePage}
                  name="workOrderProblemIssue"
                />
                <Stack.Screen
                  component={WorkOrderSparePartsListPage}
                  name="workOrderSparePartsList"
                />
                <Stack.Screen
                  component={WorkOrderAddSparePartsPage}
                  name="workOrderAddSpareParts"
                />
                <Stack.Screen
                  component={MainCheckIn}
                  name={ROUTE.MainCheckIn}
                />
                <Stack.Screen
                  component={WorkProcedurePage}
                  name={ROUTE.WORK_PROCEDURE}
                />
                <Stack.Screen
                  component={CheckInEquipment}
                  name={ROUTE.CheckInEquipment}
                />
                <Stack.Screen
                  component={WorkStatusPage}
                  name="workStatus"
                />
                <Stack.Screen
                  component={WorkProcessPage}
                  name="workProcess"
                />
                <Stack.Screen component={ToolsPage} name="tools" />
                <Stack.Screen
                  component={ToolRemainPage}
                  name="toolRemain"
                />
                <Stack.Screen
                  component={NotificationPage}
                  name="notification"
                />
                <Stack.Screen
                  component={NotificationDetail}
                  name="notificationDetail"
                />
                <Stack.Screen
                  component={LearningCenterPage}
                  name="learningCenter"
                />
                <Stack.Screen
                  component={KnowledgePage}
                  name="knowledgePage"
                />
                <Stack.Screen
                  component={KnowledgePreviewPage}
                  name={ROUTE.KNOW_LEDGE_PREVIEW_PAGE}
                />
                <Stack.Screen
                  component={SparePartPage}
                  name="sparePart"
                />
                <Stack.Screen
                  component={ManagementPlanResourcePage}
                  name="managePlanResource"
                />
                <Stack.Screen
                  component={ReportPage}
                  name="report"
                />
                <Stack.Screen
                  component={DownloadPage}
                  name="download"
                />
                <Stack.Screen
                  component={SparePartBalancePage}
                  name="sparePartBalance"
                />
                <Stack.Screen
                  component={ToolsBalancePage}
                  name="toolsBalance"
                />
                <Stack.Screen
                  component={ToolRequestTransferPage}
                  name={ROUTE.TOOLS_REQUEST_TRANSFER}
                />
                <Stack.Screen
                  component={ToolAddRequestTransferPage}
                  name={ROUTE.TOOLS_ADD_REQUEST_TRANSFER}
                />
                <Stack.Screen
                  component={SparePartVanCheckPage}
                  name="sparePartVanCheck"
                />
                <Stack.Screen
                  component={SparePartVanCheckListPage}
                  name="sparePartVanCheckList"
                />
                <Stack.Screen
                  component={ToolVanCheckPage}
                  name={ROUTE.TOOL_VAN_CHECK}
                />
                <Stack.Screen
                  component={SparePartStoreTransferPage}
                  name="sparePartStoreTransfer"
                />
                <Stack.Screen
                  component={SparePartStoreTransferCheckPage}
                  name={ROUTE.SPARE_PART_STORE_TRANSFER_CHECK}
                />
                <Stack.Screen
                  component={ToolStoreTransferPage}
                  name={ROUTE.TOOL_STORE_TRANSFER_CHECK}
                />
                <Stack.Screen
                  component={ToolStoreTransferCheckPage}
                  name={ROUTE.TOOL_STORE_TRANSFER}
                />
                <Stack.Screen
                  component={SparePartRequestTransferPage}
                  name="sparePartRequestTransfer"
                />
                <Stack.Screen
                  component={SparePartRequestTransferApprovePage}
                  name="sparePartRequestTransferApprove"
                />
                <Stack.Screen
                  component={SparePartRequestTransferWiteApprove}
                  name="sparePartRequestTransferWiteApprove"
                />
                <Stack.Screen
                  component={SparePartAddRequestTransferPage}
                  name="sparePartAddRequestTransfer"
                />
                <Stack.Screen
                  component={SparePartAddRequestTransferVan}
                  name={'SparePartAddRequestTransferVan'}
                />
                <Stack.Screen
                  component={SparePartRequestTransferVanPage}
                  name={ROUTE.SPARE_PART_REQUEST_TRANSFER_VAN}
                />
                <Stack.Screen
                  component={SparePartTransferPage}
                  name="sparePartTransfer"
                />
                <Stack.Screen
                  component={ToolTransferPage}
                  name={ROUTE.TOOLS_TRANSFER}
                />
                <Stack.Screen
                  component={WorkQlChecklist}
                  name="qlChecklist"
                />
                <Stack.Screen
                  component={QualityIndexNonCSD}
                  name={ROUTE.QI_CHECK_LIST_NON_CSD}
                />
                <Stack.Screen
                  component={VisitSettingWorkOrderPage}
                  name="syncWorkOrder"
                />
                <Stack.Screen
                  component={WorkOrderDeviceNumberPage}
                  name={ROUTE.WORK_ORDER_DEVICE_NUMBER}
                />
                <Stack.Screen
                  component={WorkProcedureMultiple}
                  name={ROUTE.WORK_PROCEDURE_MULTIPLE}
                />
                <Stack.Screen
                  component={ApproveWorklistPage}
                  name={ROUTE.APPROVE_WORK_LIST}
                />
                <Stack.Screen
                  component={ApproveOTPage}
                  name={ROUTE.APPROVE_OT}
                />
                <Stack.Screen
                  component={SatisfactionAssessmentFormMultiplePage}
                  name="SatisfactionAssessmentMultipleFormPage"
                />
                <Stack.Screen
                  component={WorkOrderSignatureMultiple}
                  name="WorkOrderSignatureMultiple"
                />
                {/* TODO: name ซ้ำกับ INSPECTOR_WORK_ORDER_CHECK_LIST */}
                {/* <Stack.Screen
                  component={CheckListVisitInspectorPage}
                  name="checkListVisitInspectorPage"
                /> */}
                <Stack.Screen
                  component={WorkOrderImagesOtherPage}
                  name={ROUTE.WORK_ORDER_IMAGE_OTHER}
                />
                <Stack.Screen
                  component={SparePartCheckPage}
                  name={ROUTE.SPARE_PART_CHECK_PAGE}
                />
                <Stack.Screen
                  component={ClaimPartsScreen}
                  name={ROUTE.CLAIM_PARTS_SCREEN}
                />
                <Stack.Screen
                  component={RecommendPartsScreen}
                  name={ROUTE.RecommendPartsScreen}
                />
              </Stack.Navigator>
          </ImageOtherProvider>
        </Provider>
      </DrawerProvider>
    </>
  );
};

export default RoutingPage;
