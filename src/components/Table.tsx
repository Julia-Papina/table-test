import React from "react";
import "./Table.css";

const Table: React.FC = () => {
  return (
    <div>
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
