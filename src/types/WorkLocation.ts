export type WorkLocation = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkLocationRequest = {
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  active?: boolean;
};

export type WorkLocationPatchRequest = Partial<WorkLocationRequest>;
