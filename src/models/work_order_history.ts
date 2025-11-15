export interface HistoryOrderHeaderInterface {
  work_order_historyorder_header_id: number;
  orderid: string;
  orderid_history: string;
  customer: string;
  notif_no: string;
  notif_longtext: string;
  order_type: string;
  notif_date: string;
  notif_time: string;
  notif_incident: string;
  equipment: string;
  notif_codegroup: string;
  notif_code: string;
  notif_code_text: string;
  notif_objpart_codegroup: string;
  notif_objpart_code: string;
  notif_objpart_text: string;
  notif_problem_codegroup: string;
  notif_problem_codeg: string;
  notif_problem_text: string;
  notif_cause_codegroup: string;
  notif_cause_codeg: string;
  notif_cause_text: string;
  notif_act_codegroup: string;
  notif_act_codeg: string;
  notif_act_text: string;
  history_sparepart: HistorySparePartInterface[];
}

export interface HistorySparePartInterface {
  material: string;
  matl_desc: string;
  quantity: any;
  unit: any;
}
