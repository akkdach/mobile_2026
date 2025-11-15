import { Provider } from '@ant-design/react-native';
import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
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
import { View } from 'react-native';

const RoutingPage = () => {
  const Stack = createNativeStackNavigator();

  return (
    <>
      <DrawerProvider>
        <Provider>
          <ImageOtherProvider>
            {/* <Router> */}
            <Stack.Navigator
              key="root"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                key="landing"
                component={LandingPage}
                name="Landing"
              />
              {/* <Stack.Screen key="login" component={LoginPage} name="Login" /> */}
              {/* <Stack.Screen key="main" component={AppMain} name="appMain" />
              <Stack.Screen
                key="mainMenu"
                component={MainMenuPage}
                name="MainMenu"
              />

              <Stack.Screen
                key="startWork"
                component={StartWorkPage}
                name="Start Work"
              />
              <Stack.Screen
                key="qualityIndex"
                component={QualityIndex}
                name="Quality Index"
              />
              <Stack.Screen
                key="workOrderDetailsWork"
                component={WorkOrderDetailsWorkPage}
                name="Work Order Details Work"
              />
              <Stack.Screen
                key="workorder"
                component={WorkOrderPage}
                name="work Order"
              />
              <Stack.Screen
                key="workOrderList"
                component={WorkOrderListPage}
                name="work Order Details List"
              />
              <Stack.Screen
                key="sparepartOutstanding"
                component={SparePartOutstandingPage}
                name="sparepart outstanding"
              />
              <Stack.Screen
                key="worklist"
                component={WorklistPage}
                name="Worklist"
              />
              <Stack.Screen
                key="visit"
                component={VisitPage}
                name="Inspector"
              />
              <Stack.Screen
                key="workOrderConnectivity"
                component={WorkOrderConnectivityPage}
                name="workOrderConnectivity"
              />
              <Stack.Screen
                key="inspector"
                component={InspectorPage}
                name="Inspector"
              />
              <Stack.Screen
                key="inspectorWorkItem"
                component={InspectorWorkItemPage}
                name="Inspector Work Item"
              />
              <Stack.Screen
                key={ROUTE.INSPECTOR_WORK_ORDER_DETAILS}
                component={InspectorWorkOrderDetailsWorkPage}
                name="Inspector Work Order Detail"
              />
              <Stack.Screen
                key={ROUTE.INSPECTOR_WORK_ORDER_QUALITY_INDEX}
                component={InspectorWorkOrderQualityIndexPage}
                name="Inspector Work Order Quality Index"
              />
              <Stack.Screen
                key={ROUTE.INSPECTOR_WORK_ORDER_CHECK_LIST}
                component={InspectorWorkOrderCheckListPage}
                name="Inspector Work Order CheckList"
              />
              <Stack.Screen
                key={ROUTE.INSPECTOR_SATISFACTION_ASSESSMENT_FORM}
                component={InspectorSatisfactionAssessmentFormPage}
                name="InspectorSatisfactionAssessment"
              />
              <Stack.Screen
                key="inspectorWorkOrderSignature"
                component={InspectorWorkOrderSignature}
                name="InspectorWorkOrderSignature"
              />
              <Stack.Screen
                key="profile"
                component={ProfilePage}
                name="profile"
              />
              <Stack.Screen
                key="assessmentForm"
                component={SatisfactionAssessmentFormPage}
                name="assessmentForm"
              />
              <Stack.Screen
                key="workSignature"
                component={WorkOrderSignature}
                name="workSignature"
              />
              <Stack.Screen
                key="workCamera"
                component={WorkOrderCameraPage}
                name="workCamera"
              />
              <Stack.Screen
                key="workImage"
                component={WorkImagePage}
                name="workImage"
              />
              <Stack.Screen
                key="workOrderDetails"
                component={WorkOrderDetailsPage}
                name="workOrderDetails"
              />
              <Stack.Screen
                key="workOrderHistory"
                component={WorkOrderHistoryPage}
                name="workOrderHistory"
              />
              <Stack.Screen
                key="workOrderMaps"
                component={WorkOrderMapsPage}
                name="workOrderMaps"
              />
              <Scene
                key="workOrderPmCheckList"
                component={WorkOrderPmCheckListPage}
                name="workOrderPmCheckList"
              />
              <Stack.Screen
                key="workOrderCCPCheck"
                component={WorkOrderCCPCheck}
                name="workOrderCCPCheck"
              />
              <Stack.Screen
                key="workOrderProblemIssue"
                component={WorkOrderProblemIssuePage}
                name="workOrderProblemIssue"
              />
              <Stack.Screen
                key="workOrderSparePartsList"
                component={WorkOrderSparePartsListPage}
                name="workOrderSparePartsList"
              />
              <Stack.Screen
                key="workOrderAddSpareParts"
                component={WorkOrderAddSparePartsPage}
                name="workOrderAddSpareParts"
              />
              <Scene
                key={ROUTE.MainCheckIn}
                component={MainCheckIn}
                name="MainCheckIn"
              />
              <Scene
                key={ROUTE.WORK_PROCEDURE}
                component={WorkProcedurePage}
                name="workProcedure"
              />
              <Scene
                key={ROUTE.CheckInEquipment}
                component={CheckInEquipment}
                name="CheckInEquipment"
              />
              <Stack.Screen
                key="workStatus"
                component={WorkStatusPage}
                name="workStatus"
              />
              <Stack.Screen
                key="workProcess"
                component={WorkProcessPage}
                name="workProcess"
              />
              <Stack.Screen key="tools" component={ToolsPage} name="tools" />
              <Stack.Screen
                key="toolRemain"
                component={ToolRemainPage}
                name="toolRemain"
              />
              <Stack.Screen
                key="notification"
                component={NotificationPage}
                name="Notification"
              />
              <Stack.Screen
                key="notificationDetail"
                component={NotificationDetail}
                name="notificationDetail"
              />
              <Stack.Screen
                key="learningCenter"
                component={LearningCenterPage}
                name="LearningCenter"
              />
              <Stack.Screen
                key="knowledgePage"
                component={KnowledgePage}
                name="KnowledgePage"
              />
              <Stack.Screen
                key={ROUTE.KNOW_LEDGE_PREVIEW_PAGE}
                component={KnowledgePreviewPage}
                name="KnowledgePreviewPage"
              />

              <Stack.Screen
                key="sparePart"
                component={SparePartPage}
                name="SparePart"
              />
              <Stack.Screen
                key="managePlanResource"
                component={ManagementPlanResourcePage}
                name="Management Plan Resource"
              />
              <Stack.Screen key="report" component={ReportPage} name="Report" />
              <Stack.Screen
                key="download"
                component={DownloadPage}
                name="Download"
              />
              <Stack.Screen
                key="sparePartBalance"
                component={SparePartBalancePage}
                name="SparePart Balance"
              />
              <Stack.Screen
                key="toolsBalance"
                component={ToolsBalancePage}
                name="Tools Balance"
              />
              <Stack.Screen
                key={ROUTE.TOOLS_REQUEST_TRANSFER}
                component={ToolRequestTransferPage}
                name="Tools Request Transfer"
              />
              <Stack.Screen
                key={ROUTE.TOOLS_ADD_REQUEST_TRANSFER}
                component={ToolAddRequestTransferPage}
                name="Tools Request Transfer"
              />
              <Stack.Screen
                key="sparePartVanCheck"
                component={SparePartVanCheckPage}
                name="SparePart Check"
              />
              <Stack.Screen
                key="sparePartVanCheckList"
                component={SparePartVanCheckListPage}
                name="SparePart Check List"
              />
              <Stack.Screen
                key={ROUTE.TOOL_VAN_CHECK}
                component={ToolVanCheckPage}
                name="Tool Van Check"
              />
              <Stack.Screen
                key="sparePartStoreTransfer"
                component={SparePartStoreTransferPage}
                name="SparePart Store Transfer"
              />
              <Stack.Screen
                key={ROUTE.SPARE_PART_STORE_TRANSFER_CHECK}
                component={SparePartStoreTransferCheckPage}
                name="SparePart Store Transfer Check"
              />
              <Stack.Screen
                key={ROUTE.TOOL_STORE_TRANSFER_CHECK}
                component={ToolStoreTransferPage}
                name="Tool Store Transfer Check"
              />
              <Stack.Screen
                key={ROUTE.TOOL_STORE_TRANSFER}
                component={ToolStoreTransferCheckPage}
                name="Tool Store Transfer Check"
              />
              <Stack.Screen
                key="sparePartRequestTransfer"
                component={SparePartRequestTransferPage}
                name="SparePart Request Transfer"
              />
              <Stack.Screen
                key="sparePartRequestTransferApprove"
                component={SparePartRequestTransferApprovePage}
                name="SparePart Request Transfer"
              />
              <Stack.Screen
                key="sparePartRequestTransferWiteApprove"
                component={SparePartRequestTransferWiteApprove}
                name="SparePart Request Transfer Wite Approve"
              />
              <Stack.Screen
                key="sparePartAddRequestTransfer"
                component={SparePartAddRequestTransferPage}
                name="SparePart Add Request Transfer"
              />
              <Stack.Screen
                key={'SparePartAddRequestTransferVan'}
                component={SparePartAddRequestTransferVan}
                name="Spare Part Add Request Transfer"
              ></Stack.Screen>
              <Stack.Screen
                key={ROUTE.SPARE_PART_REQUEST_TRANSFER_VAN}
                component={SparePartRequestTransferVanPage}
                name="SparePartRequestTransferVan"
              ></Stack.Screen>
              <Stack.Screen
                key="sparePartTransfer"
                component={SparePartTransferPage}
                name="SparePart Transfer"
              />
              <Stack.Screen
                key={ROUTE.TOOLS_TRANSFER}
                component={ToolTransferPage}
                name="Tools Transfer"
              />
              <Stack.Screen
                key="qlChecklist"
                component={WorkQlChecklist}
                name="workOrderQlChecklist"
              />
              <Stack.Screen
                key={ROUTE.QI_CHECK_LIST_NON_CSD}
                component={QualityIndexNonCSD}
                name="workOrderQlChecklist"
              />
              <Stack.Screen
                key="syncWorkOrder"
                component={VisitSettingWorkOrderPage}
                name="visitSettingWorkOrderPage"
              />
              <Stack.Screen
                key={ROUTE.WORK_ORDER_DEVICE_NUMBER}
                component={WorkOrderDeviceNumberPage}
                name="WorkOrder Device Number"
              />
              <Stack.Screen
                key={ROUTE.WORK_PROCEDURE_MULTIPLE}
                component={WorkProcedureMultiple}
                name="Work procedure multiple route"
              />
              <Stack.Screen
                key={ROUTE.APPROVE_WORK_LIST}
                component={ApproveWorklistPage}
                name="อนุมัติเปลี่ยนฯ"
              />
              <Stack.Screen
                key={ROUTE.APPROVE_OT}
                component={ApproveOTPage}
                name="อนุมัติ OT"
              />
              <Stack.Screen
                key={ROUTE.SATISFACTION_ASSESSMENT_MULTIPLE_FORM_PAGE}
                component={SatisfactionAssessmentFormMultiplePage}
                name="SatisfactionAssessmentFormPage"
              />
              <Stack.Screen
                key="WorkOrderSignatureMultiple"
                component={WorkOrderSignatureMultiple}
                name="WorkOrderSignatureMultiple"
              />

              <Stack.Screen
                key="checkListVisitInspectorPage"
                component={CheckListVisitInspectorPage}
                name="checkListVisitInspectorPage"
              />

              <Stack.Screen
                key={ROUTE.WORK_ORDER_IMAGE_OTHER}
                component={WorkOrderImagesOtherPage}
                name="workOrderImagesOther"
              />

              <Stack.Screen
                key={ROUTE.SPARE_PART_CHECK_PAGE}
                component={SparePartCheckPage}
                name="sparePartCheckPage"
              />
              <Stack.Screen
                key={ROUTE.CLAIM_PARTS_SCREEN}
                component={ClaimPartsScreen}
                name="sparePartCheckPage"
              />
              <Stack.Screen
                key={ROUTE.RecommendPartsScreen}
                component={RecommendPartsScreen}
                name="RecommendPartsScreen"
              /> */}
            </Stack.Navigator>
            {/* </Router> */}
          </ImageOtherProvider>
        </Provider>
      </DrawerProvider>
    </>
  );
};

export default RoutingPage;
