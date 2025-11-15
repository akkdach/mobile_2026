import moment from 'moment';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type WorkDurationProps = {
  startTime: string; // ISO format เช่น "2025-09-30T18:16:45.589Z"
  endTime: string;   // ISO format เช่น "2025-09-30T18:16:48.794Z"
};

// 🗓 แปลงเวลาเป็นรูปแบบไทย: วัน/เดือน/ปี พ.ศ. ชั่วโมง:นาที
const formatThaiDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '⛔️ เวลาผิดพลาด';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Bangkok',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const localeDate = date.toLocaleString('th-TH', options);
  const [datePart, timePart] = localeDate.split(' ');
  if (!datePart || !timePart) return '⛔️ รูปแบบเวลาไม่ถูกต้อง';

  const [day, month, year] = datePart.split('/');
  if (!day || !month || !year) return '⛔️ ข้อมูลวันที่ไม่ครบ';

  const buddhistYear = (parseInt(year, 10) + 543).toString();
  return `${day}/${month}/${buddhistYear} ${timePart}`;
};


const formatDuration = (startTime: string, endTime: string): string => {
  const start = moment(startTime);
  const end = moment(endTime);

  const duration = moment.duration(end.diff(start));

  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();

  let result = '';
  if (days > 0) result += `${days} วัน `;
  if (hours > 0 || days > 0) result += `${hours} ชั่วโมง `;
  result += `${minutes} นาที`;

  return result.trim();
};



const WorkDuration: React.FC<WorkDurationProps> = ({ startTime, endTime }) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
console.log(startTime, endTime )
  const durationMs = end.getTime() - start.getTime();
  const durationSec = (durationMs / 1000).toFixed(0);

  return (
    <View style={styles.card}>
      <Text style={styles.header}>⏳ ระยะเวลาการทำงาน</Text>
      <Text style={styles.row}>🟢 เริ่ม: {moment(startTime).format('DD/MM/YYYY HH:mm')}</Text>
      <Text style={styles.row}>🔴 จบ: {moment(endTime).format('DD/MM/YYYY HH:mm')}</Text>
      <Text style={styles.result}>⏱ รวม: {formatDuration(startTime,endTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  row: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  result: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default WorkDuration;