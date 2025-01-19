import { Dayjs } from 'dayjs';
import { Payment } from './Payment';

export type OrderExecutionStatus =
  | 'ACTIVE'
  | 'PAUSED'
  | 'CANCELED'
  | 'ARCHIVED';

export const OrderExecutionStatusEnum = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  CANCELED: 'CANCELED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type OrderExecutionStatusEnum =
  (typeof OrderExecutionStatusEnum)[keyof typeof OrderExecutionStatusEnum];

export type OrderStatus =
  | 'DESIGN'
  | 'PRINT_READY'
  | 'PRINTING'
  | 'SEWING'
  | 'SHIP_READY'
  | 'SHIPPED'
  | 'DONE';

export enum OrderStatusEnum {
  DESIGN = 'DESIGN',
  PRINT_READY = 'PRINT_READY',
  PRINTING = 'PRINTING',
  SEWING = 'SEWING',
  SHIP_READY = 'SHIP_READY',
  SHIPPED = 'SHIPPED',
  DONE = 'DONE',
}

export const orderStatusArray = [
  'DESIGN',
  'PRINT_READY',
  'PRINTING',
  'SEWING',
  'SHIP_READY',
  'SHIPPED',
  'DONE',
];

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
};

export type OrderOverview = {
  id: number;
  name: string;
  description: string;
  status: OrderStatus;
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
};

export type GetAllPaginatedResponse = {
  page: number;
  perPage: number;
  total: number;
  totalElements: number;
  data: OrderOverview[];
};

export type PostServices = 'd' | 'city' | 'aks' | 'post' | 'bex';
