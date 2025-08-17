export type ConfigType =
  | 'POST_SERVICE'
  | 'EQUIPMENT_TYPE'
  | 'PRINT_TYPE'
  | 'SIZES'
  | 'TEMPLATES'
  | 'PRICE_LIST'
  | 'GENERAL';

export type GenericConfigType = Extract<
  ConfigType,
  'POST_SERVICE' | 'EQUIPMENT_TYPE' | 'PRINT_TYPE'
>;

export type GenericConfig = {
  id?: number;
  type: GenericConfigType;
  value: string;
};
