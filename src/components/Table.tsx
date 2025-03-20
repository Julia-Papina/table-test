import React from "react";
import { TableItem, TableProps } from "../utils/types/TableType";
import "./Table.css";

// Преобразовала данные в древовидную структуру
const buildTreeElements = (data: TableItem[]): TableItem[] => {
    const map: { [key: number]: TableItem } = {};
    const rootsElements: TableItem[] = [];
  
    // Хэш-таблица для быстрого доступа по id
    data.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });
  
    // Дерево элементов
    data.forEach((item) => {
      if (item.parentId !== 0) {
        map[item.parentId].children?.push(map[item.id]);
      } else {
        rootsElements.push(map[item.id]);
      }
    });
  
    return rootsElements;
  };
  

const Table: React.FC<TableProps> = ({data}) => {
  return (
    <div>
     <button className="filter-button">
        Активные
      </button>
      <table className="table">
        <thead>
          <tr>
            <th className="table__th">Имя</th>
            <th className="table__th">Email</th>
            <th className="table__th">Баланс</th>
            <th className="table__th">Статус</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default Table;
