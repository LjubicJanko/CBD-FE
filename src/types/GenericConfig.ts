export type ConfigType =
  | 'POST_SERVICE'
  | 'GEAR_CATEGORY'
  | 'GEAR_TYPE'
  | 'VAT'
  | 'CURRENCY'
  | 'GEAR'
  | 'PRINT_TYPE'
  | 'SIZES'
  | 'TEMPLATES'
  | 'PRICE_LIST'
  | 'GENERAL';

export type GenericConfigType = Extract<
  ConfigType,
  'CURRENCY' | 'POST_SERVICE' | 'GEAR_CATEGORY' | 'GEAR_TYPE' | 'VAT' | 'PRINT_TYPE'
>;

export type GenericConfig = {
  id?: number;
  type: GenericConfigType;
  value: string;
};
