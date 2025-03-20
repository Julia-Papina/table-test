import React, { JSX, useState, useMemo } from "react";
import {
  TableItem,
  TableProps,
  SortConfigRows,
} from "../utils/types/TableType";
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
  const [expandedRows, setExpandedRows] = useState<number[]>([]); // состояние раскрытие строк
  const [filterActiveRows, setFilterActiveRows] = useState<boolean>(false); //состояние фильтрации строк
  const [sortConfigRows, setSortConfigRows] = useState<SortConfigRows | null>(
    null
  ); //состояние сортировки строк

  const handleFilterChange = () => {
    setFilterActiveRows(!filterActiveRows);
  };

  const handleRowClick = (id: number) => {
    if (expandedRows.includes(id)) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows([...expandedRows, id]);
    }
  };

  const treeData = buildTreeElements(data);

  const handleSort = (key: keyof TableItem) => {
    let setting: "ascending" | "descending" = "ascending";

    if (
      sortConfigRows !== null &&
      sortConfigRows.key === key &&
      sortConfigRows.setting === "ascending"
    ) {
      setting = "descending";
    }

    setSortConfigRows({ key, setting });
  };

  const sortedData = useMemo(() => {
    const sortableData = [...treeData];
    if (sortConfigRows !== null) {
      const { key, setting } = sortConfigRows;
      sortableData.sort((a, b) => {
        const valueA = a[key] ?? ""; 
        const valueB = b[key] ?? ""; 

        if (valueA < valueB) {
          return setting === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return setting === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [treeData, sortConfigRows]);

  const filteredData = filterActiveRows
    ? sortedData.filter((item) => item.isActive)
    : sortedData;

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
          <td>{item.isActive ? "Активный" : "Неактивный"}</td>
        </tr>
        {isExpanded &&
          hasChildren &&
          item.children?.map((child) => renderRowTable(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="table-container">
      <button className="filter-button" onClick={handleFilterChange}>
        {filterActiveRows ? "Смотреть все" : "Активные"}
      </button>
      <table className="table">
        <thead>
          <tr>
            <th className="table__th" onClick={() => handleSort("name")}>
              Имя
            </th>
            <th className="table__th" onClick={() => handleSort("email")}>
              Email
            </th>
            <th className="table__th" onClick={() => handleSort("balance")}>
              Баланс
            </th>
            <th className="table__th_status">Статус</th>
          </tr>
        </thead>
        <tbody>{filteredData.map((item) => renderRowTable(item))}</tbody>
      </table>
    </div>
  );
};

export default Table;
