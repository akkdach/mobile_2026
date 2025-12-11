import moment from "moment";
import 'moment/locale/th';

export const convertDateToThaiMonthDayThai = (date: any, format: any = 1) => {
  const thday = new Array(
    'อาทิตย์',
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัส',
    'ศุกร์',
    'เสาร์',
  );

  const thmonth = new Array(
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  );

  const now = new Date(
    (typeof date === 'string' ? moment(date) : date).toLocaleString('en-US', {
      timeZone: 'Asia/Bangkok',
    }),
  );

  switch (format) {
    case 1:
      return `${now.getDate()} ${thmonth[now.getMonth()]} ${
        thday[now.getDay()]
      }`;
    case 2:
      return ` ${thday[now.getDay()]}  ${now.getDate()} ${
        thmonth[now.getMonth()]
      } ${now.getFullYear()} `;
    default:
      return `${now.getDate()} ${thmonth[now.getMonth()]} ${
        thday[now.getDay()]
      }`;
  }
};
