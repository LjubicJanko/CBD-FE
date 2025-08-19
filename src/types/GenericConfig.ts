export type ConfigType =
  | 'POST_SERVICE'
  | 'GEAR_CATEGORY'
  | 'GEAR'
  | 'PRINT_TYPE'
  | 'SIZES'
  | 'TEMPLATES'
  | 'PRICE_LIST'
  | 'GENERAL';

export type GenericConfigType = Extract<
  ConfigType,
  'POST_SERVICE' | 'GEAR_CATEGORY' | 'PRINT_TYPE'
>;

export type GenericConfig = {
  id?: number;
  type: GenericConfigType;
  value: string;
};
