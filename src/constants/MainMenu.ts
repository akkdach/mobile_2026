import {ROUTE} from './RoutePath';

export const mainMenus = (role: any) => {
  console.log('[role]', role);
  let roleMap: any = {};
  const menus = {
    checkInt: [
      {
        icon: 'user-add',
        title: 'เข้าไปปฏิบัติงาน',
        modals: true,
        route: '',
        role: ['Admin', 'Manager', 'Supervisor', 'User', 'Super'],
      },
      {
        icon: 'environment',
        title: 'ออกไปปฏิบัติงาน',
        modals: false,
        route: ROUTE.START_WORK,
        role: ['Admin', 'Manager', 'Supervisor', 'User', 'Super'],
      },
    ],
    listMenu: [
      {
        icon: 'shop',
        title: 'Work Order',
        modals: false,
        route: ROUTE.WORKORDER,
        role: ['Admin', 'Manager', 'Supervisor', 'Super', 'User'],
      },
      // {
      //   icon: 'ordered-list',
      //   title: 'Work List',
      //   modals: false,
      //   route: ROUTE.WORKLIST,
      //   role: ['Admin', 'Manager', 'Supervisor', 'Super'],
      //   // role: ['Admin', 'Manager', 'Supervisor', 'Super'],
      // },
      {
        icon: 'file-done',
        title: 'Visit / Inspector',
        modals: false,
        route: ROUTE.INSPECTOR,
        role: ['Admin', 'Manager', 'Supervisor', 'Super'],
      },
      {
        icon: 'tool',
        title: 'อะไหล่',
        modals: false,
        route: ROUTE.SPARE_PART,
        role: ['Admin', 'Manager', 'Supervisor', 'User', 'Super'],
      },
      {
        icon: 'setting',
        title: 'เครื่องมือ',
        modals: false,
        route: ROUTE.TOOLS,
        role: ['Admin', 'Manager', 'Supervisor', 'User', 'Super'],
      },
      {
        icon: 'usergroup-add',
        title: 'จัดกำลังพล',
        modals: false,
        route: ROUTE.MANAGE_PLAN_RESOURCE,
        role: ['Admin', 'Manager', 'Supervisor', 'Dispatch', 'User', 'Super'],
      },
      {
        icon: 'file-markdown',
        title: 'แหล่งความรู้',
        modals: false,
        route: ROUTE.LEARNING_CENTER,
        role: ['Admin', 'Manager', 'Supervisor', 'Dispatch', 'User', 'Super'],
      },
      {
        icon: 'sound',
        title: 'ประกาศ',
        modals: false,
        route: ROUTE.NOTIFICATION,
        role: ['Admin', 'Manager', 'Supervisor', 'Dispatch', 'User', 'Super'],
      },
      {
        icon: 'bar-chart',
        title: 'รายงาน',
        modals: false,
        route: ROUTE.REPORT,
        role: ['Admin', 'Manager', 'Supervisor', 'Dispatch', 'User', 'Super'],
      },
      {
        title: 'อนุมัติ',
        icon: 'check',
        route: ROUTE.WORKLIST,
        role: ['Admin', 'Manager', 'Supervisor', 'Super'],
      },
    ],
  };
  let checkInt: any = [];
  let listMenu: any = [];
  menus.checkInt.map(val => {
    if (val.role.includes(role)) {
      checkInt.push(val);
    }
  });

  menus.listMenu.map(val => {
    if (val.role.includes(role)) {
      listMenu.push(val);
    }
  });
  roleMap = {...{checkInt}, ...{listMenu}};
  return roleMap;
};


export interface MenuTabInterface {
  checkInt: CheckInt[];
  listMenu: CheckInt[];
}

export interface CheckInt {
  icon: string;
  title: string;
  modals: boolean;
  route: string;
  role: string[];
}