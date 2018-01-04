export interface Product {
  id: number;
  title: string;
  featured_image: string;
  handle: string;
  compare_at_price: number;
  compare_at_price_format: string;
  price: number;
  price_format: string;
  available: boolean;
  sale: string,
  isWholeSale: boolean
}
export interface ProductDetail {
  id: number;
  handle: string;
  title: string;
  body_html: string;
  thong_so: string;
  video: string;
  product_type: string;
  compare_at_price: string;
  price: string;
  original_price: number;
  sale: string;
  vendor: string;
  tags: any[];
  images: any[];
  variants: any[];
  related_products: any[];
  related_handle: string;
  related_title: string;
  isWholeSale: boolean
  // // lợi nhuận
  // profit: number;
  // // thưởng nhị cấp
  // reward_points_1: number;
  // // thưởng tích lũy doanh số
  // reward_points_2: number;
  // // quỹ từ thiện
  // charity_fund: number;
}