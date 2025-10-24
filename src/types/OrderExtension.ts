export type OrderContactInfo = {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
};

export type OrderExtensionReqDto = {
  name: string;
  description: string;
  contactInfo: OrderContactInfo;
};
