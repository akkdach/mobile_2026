import {CardWorkListInterface} from '../models';
import {ROUTE} from './RoutePath';

const typeSetup = [
  'ZC15',
  'BN15',
  'ZC16',
  'BN16',
  'ZC17',
  'BN17',
  'ZC18',
  'BN18',
];

const orderData: CardWorkListInterface[] = [
  {
    title: 'ข้อมูลลูกค้า',
    icon: 'user',
    route: '',
    isCheckIn: false,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
    ],
  },
  {
    title: 'รายละเอียดของงาน',
    icon: 'bars',
    route: ROUTE.WORK_ORDER_DETAILS,
    isCheckIn: false,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
      ...typeSetup,
    ],
  },
  {
    title: 'ประวัติการซ่อม',
    icon: 'history',
    route: ROUTE.WORK_ORDER_HISTORY,
    isCheckIn: false,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'ZC02',
      'ZC03',
      'ZC04',
      'ZC09',
      'BN01',
      'BN02',
      'BN03',
      'BN04',
      'BN09',
      'BN15',
      'BN16',
      'BN17'
    ],
  },
  {
    title: 'แผนที่ติดตั้งอุปกรณ์ฯ',
    icon: 'environment',
    route: ROUTE.WORK_ORDER_MAP,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
      ...typeSetup,
    ],
  },
  {
    title: 'ใส่หมายเลขอุปกรณ์',
    icon: 'form',
    route: ROUTE.WORK_ORDER_DEVICE_NUMBER,
    isCheckIn: true,
    roleType: ['ZC04', 'BN04'],
  },
  {
    title: 'Check CCP',
    icon: 'edit',
    route: ROUTE.WORK_ORDER_CCP_CHECK,
    isCheckIn: true,
    roleType: [],
  },
  {
    title: 'รายการอะไหล่',
    icon: 'tool',
    route: ROUTE.WORKORDER_SPARE_PART_LIST,
    isCheckIn: true,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
      ...typeSetup,
    ],
  },
  {
    title: 'เวลาปฏิบัติงาน (ในร้านค้า)',
    icon: 'solution',
    route: ROUTE.WORK_ORDER_DETAILS_WORK,
    isCheckIn: true,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
      ...typeSetup,
    ],
  },
  {
    title: 'Connectivity',
    icon: 'swap',
    route: ROUTE.WORK_ORDER_CONNECTIVITY,
    isCheckIn: true,
    roleType: typeSetup,
  },
  {
    title: 'Check List',
    icon: 'experiment',
    route: ROUTE.QI_CHECK_LIST,
    isCheckIn: true,
    // roleType: ['ZC01', 'BN01', 'ZC03', 'BN03', 'ZC04', 'BN04', ...typeSetup],
    roleType: ['ZC01', 'BN01', 'ZC03', 'BN03', 'ZC04', 'BN04'],
  },
  // {
  //   title: 'Quality Index',
  //   icon: 'check-circle',
  //   route: ROUTE.QUALITY_INDEX,
  //   isCheckIn: true,
  //   roleType: ['TPX', 'NPX', 'TFCB', 'NFCB'],
  // },
  {
    title: 'ปัญหาที่ช่างพบ',
    icon: 'exclamation-circle',
    route: ROUTE.WORK_ORDER_PROBLEM_ISSUE,
    isCheckIn: true,
    roleType: ['ZC02', 'BN02', 'ZC03', 'BN03'],
  },
  {
    title: 'ถ่ายรูป',
    icon: 'camera',
    route: ROUTE.WORK_CAMERA,
    isCheckIn: true,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
      ...typeSetup,
    ],
  },
  // {
  //   title: 'ถ่ายรูปขั้นตอนการทำงาน',
  //   icon: 'camera',
  //   route: ROUTE.workImage,
  //   isCheckIn: true,
  //   roleType: [
  //     'ZC00',
  //     'BN00',
  //     'ZC01',
  //     'BN01',
  //     'ZC02',
  //     'BN02',
  //     'ZC03',
  //     'BN03',
  //     'ZC04',
  //     'BN04',
  //     'ZC09',
  //     'BN09',
  //     ...typeSetup,
  //   ],
  // },
  {
    title: 'สรุปปิดงาน',
    icon: 'check-square',
    route: ROUTE.ASSESSMENTFORM,
    isCheckIn: true,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
    ],
  },
  {
    title: 'สถานะของงาน',
    icon: 'question-circle',
    route: '',
    modal: true,
    isCheckIn: true,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
      ...typeSetup,
    ],
    
  }, {
    title: 'Recommend Spare Part',
    icon: 'question-circle',
    route: ROUTE.RecommendPartsScreen,
    modal: false,
    isCheckIn: true,
    roleType: [
      'ZC00',
      'BN00',
      'ZC01',
      'BN01',
      'ZC02',
      'BN02',
      'ZC03',
      'BN03',
      'ZC04',
      'BN04',
      'ZC09',
      'BN09',
      ...typeSetup,
    ],
    
  },
  // {
  //   title: 'ยกเลิกงาน',
  //   icon: 'close',
  //   route: '',
  //   modal: false,
  //   isCancel:true,
  //   roleType: [
  //     'ZC00',
  //     'BN00',
  //     'ZC01',
  //     'BN01',
  //     'ZC02',
  //     'BN02',
  //     'ZC03',
  //     'BN03',
  //     'ZC04',
  //     'BN04',
  //     'ZC09',
  //     'BN09',
  //     ...typeSetup,
  //   ],
  // },
  // {
  //   title: 'ภาพถ่ายเพิ่มเติม',
  //   icon: 'file-image',
  //   route: ROUTE.WORK_ORDER_IMAGE_OTHER,
  //   roleType: [
  //     'ZC00',
  //     'BN00',
  //     'ZC01',
  //     'BN01',
  //     'ZC02',
  //     'BN02',
  //     'ZC03',
  //     'BN03',
  //     'ZC04',
  //     'BN04',
  //     'ZC09',
  //     'BN09',
  //   ],
  // },
];

export const getMenuByWorkType = (type: string, objType: string, webStatus?: string) => {
  return orderData
    .filter((val: CardWorkListInterface) =>
      type === 'ZC01' || type === 'BN01'
        ? (val.roleType && val.roleType.indexOf(type) >= 0) ||
          (val.roleType && val.roleType.indexOf(objType) >= 0)
        : val.roleType && val.roleType.indexOf(type) >= 0,
    )
    .map(val => {
      if (typeSetup.indexOf(type) >= 0 || webStatus === '4') {
        return {...val, isCheckIn: false};
      }
      return val;
    });
};

export const notShowChargeTravel = (type: string) => {
  return typeSetup.indexOf(type) < 0 ? true : false;
};

export const isShowSignatureMessage = (type: string) => {
  return ['ZC09', 'ZC04'].indexOf(type) < 0 ? false : true;
};

export const isNotValidateCapture = (type: string) => {
  return typeSetup.indexOf(type) < 0 ? true : false;
};

export const isNotCheckActionMileage = (type: string) => {
  return typeSetup.indexOf(type) < 0 ? true : false;
};

export const isNotCheckActionCheckIn = (type: string) => {
  return typeSetup.indexOf(type) < 0 ? true : false;
};

export const isNotCheckActionPriceCheck = (type: string) => {
  return typeSetup.indexOf(type) < 0 ? true : false;
};

export const isNotCheckActionSignature = (type: string) => {
  return typeSetup.indexOf(type) < 0 ? true : false;
};

export const isShowChangeEquipment = (type: string) => {
  return ['ZC01', 'ZC02', 'ZC03'].indexOf(type) >= 0 ? true : false;
};

export const isShowChangeEquipmentMovement = (type: string) => {
  return ['ZC01', 'ZC02', 'ZC03', 'BN01', 'BN02', 'BN03'].indexOf(type) >= 0 ? true : false;
}
