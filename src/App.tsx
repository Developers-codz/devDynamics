import React, { useState } from "react";
import "./App.css";
import { Navbar, Filters, Main } from "./component";

function App() {
  const [filterData, setFilterData] = useState({});

  type FilterData = {
    developer: { value?: string | undefined; label: string };
    date?: { value?: string | undefined; label: string } | null;
  };

  const applyFilters = (data: FilterData) => {
    setFilterData(data);
  };
  return (
    <div className="App grid-container ">
      <Navbar />
      <Filters applyFilters={applyFilters} />
      <Main filterData={filterData} />
    </div>
  );
}

export default App;
