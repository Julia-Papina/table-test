import React, { JSX, useState } from "react";
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

const Table: React.FC<TableProps> = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]); //раскрытие строк

  const handleRowClick = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const treeData = buildTreeElements(data);

  // Функция для отрисовки строк таблицы и их дочерних элементов (если они есть)
  const renderRowTable = (item: TableItem, level: number = 0): JSX.Element => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedRows.includes(item.id);

    return (
      <React.Fragment key={item.id}>
        <tr
          onClick={() => handleRowClick(item.id)}
          className={`${item.isActive ? "active" : ""}`}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
        >
          <td style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren && (
              <span className="arrow-icon">{isExpanded ? "▼" : "►"}</span>
            )}
            {item.name}
          </td>
          <td>{item.email}</td>
          <td>{item.balance}</td>
          <td>{item.isActive ? "Active" : "Inactive"}</td>
        </tr>
        {isExpanded &&
          hasChildren &&
          item.children?.map((child) => renderRowTable(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div>
      <button className="filter-button">Активные</button>
      <table className="table">
        <thead>
          <tr>
            <th className="table__th">Имя</th>
            <th className="table__th">Email</th>
            <th className="table__th">Баланс</th>
            <th className="table__th">Статус</th>
          </tr>
        </thead>
        <tbody> {treeData.map((item) => renderRowTable(item))}</tbody>
      </table>
    </div>
  );
};

export default Table;
