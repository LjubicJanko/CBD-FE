
export interface GearReqDto {
  id?: number;
  name: string;
  categoryId: number;
}

export interface GearResDto {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
}
