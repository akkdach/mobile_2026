export const CloseReason = (type: any) => {
  const masterData = [
    {
      label: 'FON ลูกค้าปฏิเสธ Phone FIX',
      value: 'FON ลูกค้าปฏิเสธ Phone FIX',
      orderType: ['ZC02'],
    },
    {
      label: 'FON Phone FIX ไม่สำเร็จ',
      value: 'FON Phone FIX ไม่สำเร็จ',
      orderType: ['ZC02'],
    },
  ];

  let data: any = [];
  masterData.map(val => {
    if (val.orderType.includes(type)) {
      data.push(val);
    }
  });

  return data;
};
