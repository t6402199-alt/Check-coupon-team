export interface CouponVerificationData {
  firstName: string;
  lastName: string;
  email: string;
  couponType: string;
  otherCoupon?: string;
  couponCode: string;
  hideCode: 'OUI' | 'NON';
  montant?: string;
  couponImageName?: string;
  couponImageBase64?: string; // Optional base64 string for secure email delivery
}

export interface SupportContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
