import { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import "./style.css";
import { RowData } from "../main/main";

const Filters = ({ applyFilters }: any) => {
  type FilterData = {
    developer: SingleValue<{ value?: string | undefined; label: string }>;
    date?: SingleValue<{ value?: string | undefined; label: string }> | null;
  };

  type WorklogRow = {
    name: string;
  };

  const initialFilterData = {
    developer: null,
    date: null,
  };

  const [row, setRow] = useState<RowData[] | []>([]);
  const [developersData, setDeveloperData] = useState([]);
  const [dateData, setDateData] =
    useState<{ label: string; value: string }[]>();
  const [filterData, setFilterData] = useState<FilterData>(initialFilterData);

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        const developerData = data.data.AuthorWorklog.rows?.map(
          (el: WorklogRow) => ({ label: el?.name, value: el?.name })
        );
        setRow(data.data.AuthorWorklog.rows);
        setDeveloperData(developerData);
      });
  }, []);

  const handleChange = (
    selectedOption: SingleValue<{ value?: string; label: string }> | null
  ) => {
    const dateArr = row.filter((el) => {
      if (el.name === selectedOption?.label) {
        return el;
      }
    })[0]?.dayWiseActivity;

    const dateOptions = dateArr.map((el) => ({
      label: el.date,
      value: el.date,
    }));
    setDateData(dateOptions);
    setFilterData({ ...filterData, developer: selectedOption });
  };

  const handleDateChange = (
    selectedOption: SingleValue<{ value?: string; label: string }>
  ) => {
    setFilterData({ ...filterData, date: selectedOption });
  };

  const clearFilter = () => {
    setFilterData(initialFilterData);
  };

  return (
    <div className="sidebar">
      <div className="filter-wrapper">
        <img src="/assets/filter.svg" alt="filters" className="filter-icon" />
        <span className="filter">Filters</span>
      </div>
      <Select
        options={developersData}
        placeholder="Select Employee"
        onChange={handleChange}
        className="filter-select"
        value={filterData?.developer}
      />
      <Select
        placeholder="Choose Date"
        className="filter-select"
        value={filterData.date}
        options={dateData}
        onChange={handleDateChange}
      />
      <div className="border"></div>
      <div className="filter-footer-wrapper ">
        <button className="cta-secondary" onClick={clearFilter}>
          Clear
        </button>
        <button
          className="cta-primary"
          onClick={() => applyFilters(filterData)}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Filters;
