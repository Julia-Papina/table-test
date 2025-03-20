export type TableItem = {
  id: number;
  parentId: number;
  isActive: boolean;
  balance: string;
  name: string;
  email: string;
  children?: TableItem[];
};

export type TableProps = {
  data: TableItem[];
};
