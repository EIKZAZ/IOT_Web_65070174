export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
}

export interface Menu {
  id: number;
  name: string;
  amount: number;
  descript: string;
  price: number;
  detail: string;
}

export interface Order {
  id: number;
  name: string;
  amount: number;
  descript: string;
  price: number;
}
