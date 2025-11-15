import { HistoryOrderHeaderInterface } from ".";
export interface WorkOrder {
  orderid: string;
  order_type: string;
  cde_code: string;
  equipment: string;
  objecttype: string;
  zzequipment: string;
  eq_model: string;
  bill_no: string;
  zzcus_name: string;
  production_start_date: string;
  production_finish_date: string;
  production_start_time: string;
  production_finish_time: string;
  actual_start_time: string;
  customer_mas: CustomerMas;
  notification_header: NotificationHeader;
  operations: Operations[];
  components: ComponentsInterface[];
  historyorder_header: HistoryOrderHeaderInterface[];
}

export interface Operations {
  work_order_operation_id: number;
  orderid: string;
  activity: string;
  control_key: string;
  work_cntr: string;
  work_center: any;
  plant: string;
  description: string;
  number_of_capacities: number;
  acttype: string;
  duration_normal: number;
  duration_normal_unit: string;
  work_activity: number;
  un_work: string;
  conf_no: string;
  work_actual: number;
  act_start_date: string;
  act_start_time: string;
  act_end_date: string;
  act_end_time: string;
  system_status_text: any;
  work_actual_start: string;
  work_actual_finish: string;
}

export interface CustomerMas {
  orderid: string;
  customer: string;
  partn_role: string;
  cust_name: string;
  building: string;
  name_co: string;
  street: string;
  city1: string;
  city2: string;
  region: string;
  post_code: string;
  tel_number: string;
  country: string;
  location_code: string;
  tradename: string;
  customer_class: string;
  keyaccount: string;
  longitude: number;
  latitude: number;
  mon_mor_from: string;
  mon_mor_to: string;
  mon_even_from: string;
  mon_even_to: string;
  tue_mor_from: string;
  tue_mor_to: string;
  tue_even_from: string;
  tue_even_to: string;
  wed_mor_from: string;
  wed_mor_to: string;
  wed_even_from: string;
  wed_even_to: string;
  thu_mor_from: string;
  thu_mor_to: string;
  thu_even_from: string;
  thu_even_to: string;
  fri_mor_from: string;
  fri_mor_to: string;
  fri_even_from: string;
  fri_even_to: string;
  sat_mor_from: string;
  sat_mor_to: string;
  sat_even_from: string;
  sat_even_to: string;
  sun_mor_from: string;
  sun_mor_to: string;
  sun_even_from: string;
  sun_even_to: string;
}

export interface NotificationHeader {
  doc_link: any;
  orderid: string;
  notif_type: string;
  notif_no: string;
  notif_date: string;
  notif_time: string;
  notif_incident: string;
  notif_codegroup: string;
  notif_code: string;
  notif_code_text: string;
  notif_report_by: string;
  notif_longtext: string;
  notif_equipment: string;
  equipment_workable: any;
  zzrf_incident: string;
  zzproject: string;
  zzfirst: string;
  zzfirst_set: string;
  zzpreferdate: any;
}

export interface ComponentsInterface {
  work_order_component_id: number;
  orderid: string;
  reserv_no: string;
  res_item: string;
  movement: string;
  withdrawn: string;
  material: string;
  plant: string;
  stge_loc: string;
  batch: string;
  gl_account: string;
  item_cat: string;
  item_number: string;
  activity: string;
  price: number;
  price_unit: number;
  pur_group: string;
  matl_group: string;
  matl_desc: string;
  requirement_quantity: number;
  requirement_quantity_unit: string;
  req_date: any;
  req_time: string;
  move_type: string;
  commited_quan: number;
  warranty_check: string;
  actual_quantity: number;
  actual_quantity_unit: any;
  checked: boolean;
}

