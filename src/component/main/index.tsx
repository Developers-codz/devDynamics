import { useState, useEffect } from "react";
import "./style.css";
import { RowData, ActivityMetaData, Result } from "./main";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
} from "recharts";

const Main = ({ filterData }: any) => {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [activityMetaData, setActivityMetaData] = useState<ActivityMetaData[]>(
    []
  );

  useEffect(() => {
    fetch("/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        setRowData(data?.data?.AuthorWorklog?.rows);
        setActivityMetaData(data?.data?.AuthorWorklog?.activityMeta);
      });
  }, []);

  const COLORS = [
    "#EF6B6B",
    "#61CDBB",
    "#FAC76E",
    "#C2528B",
    "#0396A6",
    "#5F50A9",
    "#8F3519",
  ];

  const getTotalData = () => {
    let result: Result = {
      "PR Open": 0,
      "PR Merged": 0,
      "Commits": 0,
      "PR Reviewed": 0,
      "PR Comments": 0,
      "Incident Alerts": 0,
      "Incidents Resolved": 0,
    };

    const totalActivityDataArr = rowData?.map((el) => el?.totalActivity);

    totalActivityDataArr.forEach((subArray) => {
      subArray.forEach((obj) => {
        let key = obj?.name as keyof Result; // type assertion
        let value = Number(obj?.value);
        if (result?.[key]) {
          result[key] += value;
        } else {
          result[key] = value;
        }
      });
    });

    return result;
  };

  const getIndivisualData = () => {
    const { developer = {}, date = null } = filterData;
    const dayWiseActivity = rowData?.filter(
      (el) => el?.name === developer?.label
    )[0]?.dayWiseActivity;

    const items = dayWiseActivity?.filter((el) => {
      return el?.date === date?.value;
    })[0]?.items?.children;
    return items;
  };

  const getIndivisualTotalData = () => {
    const { developer = {}, date = null } = filterData;

    const totalData = rowData?.filter((el) => el?.name === developer?.label)[0]
      ?.totalActivity;
    return totalData;
  };

  return (
    <div className="main">
      <h2 className="header">
        Aggregated Metrics: PR Status, Commits, and Activities
      </h2>
      <div className="d-flex">
        <ActivityCard totalDataObj={getTotalData()} COLORS={COLORS} />
      </div>

      {Object.keys(filterData)?.length ? (
        <div>
          <h2 className="sub-header">
            Overall Developer Contributions Overview{" "}
          </h2>
          <div className="d-flex pie-wrapper">
            <PieChart width={300} height={300}>
              <Pie
                data={getIndivisualTotalData()}
                dataKey={(entry) => Number(entry.value)}
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
              >
                {(getIndivisualTotalData() || [])?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="developer-info">
              {getIndivisualTotalData()?.map((el, i) => (
                <div style={{ color: COLORS[i] }}>
                  {`${el.value} ${el.name}`}
                </div>
              ))}
            </div>
          </div>

          <h2 className="sub-header">Daywise Developer Contributions </h2>
          <div className="d-flex pie-wrapper">
            <PieChart width={300} height={300}>
              <Pie
                data={getIndivisualData()}
                dataKey={(entry) => Number(entry.count)}
                nameKey="label"
              >
                {(getIndivisualData() || [])?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <div className="developer-info">
              {getIndivisualData()?.map((el) => (
                <div style={{ color: el.fillColor }}>
                  {`${el.count} ${el.label}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <img className="no-data-img" src="/assets/no-data.jpg" />
          <div className="font-20">
            Select and Apply Filters to see the results
          </div>
        </div>
      )}

      <div className="footer-wrapper">
        {activityMetaData?.map((el) => {
          return (
            <div className="footer">
              <div
                className="color-box"
                style={{ background: el.fillColor }}
              ></div>
              <div>{el?.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ActivityCard = ({ totalDataObj, COLORS }: any) => {
  const getBarChartData = () => {
    const data: any = [];
    Object.keys(totalDataObj).forEach((el) => {
      data.push({
        name: el,
        count: totalDataObj[el],
      });
    });

    return data;
  };

  return (
    <>
      {Object.keys(totalDataObj)?.map((key, i) => {
        return (
          <div
            className="activity-wrapper pointer"
            style={{ border: `1px solid ${COLORS[i]}` }}
          >
            <div>{key}</div>
            <div className="bold font-30" style={{ color: COLORS[i] }}>
              {totalDataObj[key]}
            </div>
          </div>
        );
      })}
      <div className="margin-t-20">
        <BarChart
          width={950}
          height={250}
          data={getBarChartData()}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 40,
          }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label
              value="Different Activities"
              offset={-20}
              position="insideBottom"
            />
          </XAxis>
          <YAxis dataKey="count"></YAxis>
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          >
            {getBarChartData()?.map((el: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </>
  );
};

export default Main;
