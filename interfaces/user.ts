export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  addresses: any[];
  default_address: {};
  metafields: any[];
  birthday: string;
  gender: number;
  tags: string;
  code: string;//customer's code to invite others
  invited_code: string; //the code which customer inserted
  agency: string; // check đại lý
  agency_verified: string; // xác nhận đại lý?
  firebase_token: string;
  multipass_identifier: string;
  password: string;
  password_confirmation: string;
  logged: boolean;
  expire_logged: number;
  accepts_marketing: boolean;
  verified_email: boolean;
  send_email_invite: boolean;
  send_email_welcome: boolean;
}

export interface UserData{
  id: number;
  first_name: string;
  email: string;
  addresses: any[];
  metafields: any[];
  birthday: string;
  tags: string;
  code: number;//customer's code to invite others
  invited_code: number; //the code which customer inserted
  firebase_token: string;
  multipass_identifier: string;
  password: string;
  password_confirmation: string;
  logged: boolean;
  expire_logged: number;
  accepts_marketing: boolean;
  verified_email: boolean;
  send_email_invite: boolean;
  send_email_welcome: boolean;
}
// update user
export interface UpdateUser {
  first_name: string;
  birthday: string;
  address1: number;
  bank: string;
  bank_branch: string;
  account_name: string;
  account_number: number;
  individual_tax_number: number;
  tags: string;
  gender: number
}
// thong tin bank
export interface UserBank{
  bank: string;
  bank_branch: string;
  account_name: string;
  account_number: number;
  individual_tax_number: number
}
export interface UserRegister{
  first_name: string;
  email: string;
  phone: number;
  birthday: string;
  tags: string;
  invited_code: number;
  password: string;
  password_confirmation: string;
  accepts_marketing: boolean;
  accepts_agency: boolean;
  address: string;
  type: string;
  gender: 0,
  fcm_token: ''
}

export interface UserOption{
  email: string;
  password: string;
}
export interface Order {
  id: number;
  name: string; // ma don hang
  created_at: string;
  financial_status: string; //tinh trang thanh toán: paid (Đã thanh toán)/pending/refunded (Đã nhập trả)
  fulfillment_status: string; //tinh trang hoàn thành: notfulfilled (chưa giao)/fulfilled (Hoàn thành)
  cancelled_status:string;
  first_item: {}; //danh sách sp trong đơn hàng
  total_price: number; //tổng tiền
  count_items: number; //tổng số loại sp
  reward_points_2: number // thuong tich luy
}
export interface OrderStatic {
  id: number;
  reward_points_2: number; // thuong tich luy
  reward_points_1: number; // thuong nhi cap
}
export interface DetailOrder {
  name: string; // ma don hang
  line_items: any[]; //danh sách sp trong đơn hàng, gồm (tên sp, variant, price, quantity)
  count_items: number; //tổng số loại sp
  total_discounts: number; // tổng tiền khuyến mãi được giảm
  discount_codes: any[]; // ds ma khuyến mãi
  shipping_price: number; // phí vận chuyển
  total_price: number; //tổng tiền
  financial_status: string; //tinh trang thanh toán: paid (Đã thanh toán)/pending/refunded (Đã nhập trả)
  fulfillment_status: string; //tinh trang vận chuyển: notfulfilled (chưa giao)/fulfilled (Hoàn thành)
  cancelled_status: string;
  cancel_reason: string;
  billing_address: {}; //thông tin (địa chỉ, tên, sđt) người nhận
  reward_points_2: number; // thuong tich luy
}

