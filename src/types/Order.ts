import { Dayjs } from 'dayjs';
import { Payment } from './Payment';

export const OrderExecutionStatusEnum = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  CANCELED: 'CANCELED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type OrderExecutionStatus = keyof typeof OrderExecutionStatusEnum;

export type OrderExecutionStatusEnum =
  (typeof OrderExecutionStatusEnum)[keyof typeof OrderExecutionStatusEnum];

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  DESIGN = 'DESIGN',
  PRINT_READY = 'PRINT_READY',
  PRINTING = 'PRINTING',
  SEWING = 'SEWING',
  SHIP_READY = 'SHIP_READY',
  SHIPPED = 'SHIPPED',
  DONE = 'DONE',
}

export type OrderStatus = keyof typeof OrderStatusEnum;

export enum OrderPriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type OrderPriority = keyof typeof OrderPriorityEnum;

export const orderStatusArray = [
  'PENDING',
  'DESIGN',
  'PRINT_READY',
  'PRINTING',
  'SEWING',
  'SHIP_READY',
  'SHIPPED',
  'DONE',
];

export const orderPriorityArray = ['LOW', 'MEDIUM', 'HIGH'];

export type OrderStatusHistory = {
  id: number;
  status: OrderStatus;
  closingComment: string;
  creationTime: string;
  user: string;
  postalCode?: string;
  postalService?: string;
};

export type CreateOrder = {
  name: string;
  description: string;
  note: string;
  plannedEndingDate: string | number | Dayjs;
  legalEntity: boolean;
  acquisitionCost?: number;
  salePrice?: number;
  priority: OrderPriority;
};

export type ContactInfoData = {
  fullName: string;
  zipCode: string;
  city: string;
  address: string;
  phoneNumber: string;
};

export type OrderOverview = {
  id: number;
  name: string;
  description: string;
  status: OrderStatus;
  priority: OrderPriority;
  executionStatus: OrderExecutionStatus;
  plannedEndingDate: string;
  dateWhenMovedToDone?: string;
  amountLeftToPay?: number;
  postalCode?: string;
  postalService?: string;
};

export type Order = {
  id: number;
  trackingId: string;
  name: string;
  description: string;
  note: string;
  status: OrderStatus;
  priority: OrderPriority;
  executionStatus: OrderExecutionStatus;
  statusHistory: OrderStatusHistory[];
  acquisitionCost: number;
  salePrice: number;
  salePriceWithTax?: number;
  legalEntity: boolean;
  postalService: string;
  postalCode: string;
  plannedEndingDate: string;
  amountPaid: number;
  amountLeftToPay: number;
  payments: Payment[];
  pausingComment: string;
  priceDifference?: number;
  extension?: boolean;
  contactInfo?: ContactInfoData;
};

export type OrderTracking = {
  id: number;
  trackingId: string;
  name: string;
  description: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  postalService: string;
  postalCode: string;
  plannedEndingDate: string;
  lastUpdatedDate: string;
  legalEntity: boolean;
  amountLeftToPay: number;
  amountLeftToPayWithTax?: number;
  extension?: boolean;
  contactInfo?: ContactInfoData;
};

export type GetAllPaginatedResponse = {
  page: number;
  perPage: number;
  total: number;
  totalElements: number;
  data: OrderOverview[];
};

export type PostServices = 'd' | 'city' | 'aks' | 'post' | 'bex';
