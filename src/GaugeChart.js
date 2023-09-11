import React from "react";
import GaugeChart from "react-gauge-chart";

const MyGaugeChart = ({ commits }) => {
  // Calculate the percentage based on commits (limit to 100% if greater than 10)
  const percentage = commits > 10 ? 1 : commits / 10;

  return (
    <div className="gauge-chart">
      <GaugeChart id="gauge-chart" percent={percentage} />
    </div>
  );
};

export default MyGaugeChart;
