export enum SystemRoles {
   ADMIN= 'admin',
   USER= 'user',
}

export enum GenderEnum {
   MALE= 'male',
   FEMALE= 'female',
}

export enum OTPTypes{
   CONFIRMATION= 'confirmation',
   RESET_PASSWORD= 'reset_password',
}


export const Badges = {
  NEW: "New",
  SALE: "Sale",
  BEST_SELLER: "Best Seller",
};

export const DiscountType = {
  PERCENTAGE: "Percentage",
  AMOUNT: "Amount",
};

export enum CouponTypes {
  PERCENTAGE= "Percentage",
  AMOUNT="Amount",
};
export enum paymentMethods{
  Stripe="stripe", // payment method cash or stripe hbd2 mn placed
  Cash="cash",// => hbd2 mn pending 
  Paymob="paymob",// => hbd2 mn pending 
}
export enum OrderStatus{
  Pending="pending",
  Confirmed="confirmed",
  Delivered="delivered",
  Cancelled="cancelled",
  Placed="placed",
  Refunded="refunded",
  Returned="returned", // l user rfd ystlm
  Dropped="dropped", // l user msh mwgod ashan ystlm
  OnWay="onway",
  PAID="paid", // l user dafa3 w mstlmsh
}
export enum ReviewStatus{
  Pending="pending",
  Rejected="rejected",
  Approved="approved",
}

