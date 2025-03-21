import Table from "./components/Table";
import { data } from "./utils/constants/data";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Table data={data}/>
    </div>
  );
}

export default App;
