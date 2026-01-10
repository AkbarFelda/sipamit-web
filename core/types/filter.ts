export interface Wilayah {
  id: number;
  nama: string;
}

export interface FilterResponse {
  success: boolean;
  data: Wilayah[];
}