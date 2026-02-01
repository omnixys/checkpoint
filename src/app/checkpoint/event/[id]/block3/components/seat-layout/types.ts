export interface SeatNode {
  id: string;
  x: number;
  y: number;
  rotation: number;
  number: number;
  status: string;
  meta?: any;
}

export interface TableNode {
  id: string;
  name: string;
  x: number;
  y: number;
  meta?: any;
  seats: SeatNode[];
}

export interface SectionNode {
  id: string;
  name: string;
  x: number;
  y: number;
  meta?: any;
  tables: TableNode[];
}
