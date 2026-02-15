
export interface UserData {
  name: string;
  email: string;
}

export interface CouponResponse {
  welcomeMessage: string;
  couponCode: string;
  expiryDate: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
