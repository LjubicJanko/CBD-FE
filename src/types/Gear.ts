
export interface GearReqDto {
  id?: number;
  name: string;
  categoryId: number;
  typeId: number;
}

export interface GearResDto {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  typeId: number;
  typeName: string;
}
