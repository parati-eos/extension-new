import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ChartIcon from "../../../assets/ci_chart-line.png";
import BarIcon from "../../../assets/uis_graph-bar.png";
import PieIcon from "../../../assets/flowbite_chart-pie-solid.png";

export default function Graphs() {
  const [currentScreen, setCurrentScreen] = useState<
    "chartSelection" | "inputScreen"
  >("chartSelection");
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [rows, setRows] = useState([{ label: "", services: "" }]); // Tracks rows for Label and Services
  const [series, setSeries] = useState(1); // Tracks the number of columns (series)

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType);
    setCurrentScreen("inputScreen");
    setRows([{ label: "", services: "" }, { label: "", services: "" }]); // Reset rows to two default
    setSeries(1); // Reset series to one
  };

  const handleBackClick = () => {
    setCurrentScreen("chartSelection");
    setSelectedChart(null);
  };

  const addRow = () => {
    if (rows.length < 10) {
      setRows([...rows, { label: "", services: "" }]);
    } else {
      alert("Maximum of 10 rows can be added.");
    }
  };

  const addSeries = () => {
    setSeries(series + 1);
  };

  const handleInputChange = (rowIndex: number, column: string, value: string) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [column]: value } : row
    );
    setRows(updatedRows);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F7FA] h-full w-full">
      {currentScreen === "chartSelection" ? (
        // Chart Selection Screen
        <div className="w-full h-full bg-white lg:flex lg:flex-col lg:p-4 lg:sm:p-8 lg:mx-auto">
          <p className="hidden lg:block font-bold break-words">Graphs</p>
          <button
            type="button"
            className="hidden md:block px-6 py-2 border border-[#8A8B8C] bg-white text-[#797C81] hover:bg-[#F0F0F0] rounded-md transition ml-auto"
            onClick={handleBackClick}
          >
            Back
          </button>
          <h2 className="text-l text-[#091220] w-[17rem] font-light ml-2 mt-24">
            Select chart type
          </h2>
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mr-5 ml-2">
            <div
              className="flex flex-col items-center border border-gray-300 h-fit w-fit px-12 py-2 lg:py-4 rounded-md cursor-pointer"
              onClick={() => handleChartClick("Line")}
            >
              <img src={ChartIcon} alt="Chart Icon" className="h-16 w-16" />
              <span>Line</span>
            </div>
            <div
              className="flex flex-col items-center border border-gray-300 h-fit w-fit px-12 py-2 lg:py-4 rounded-md cursor-pointer"
              onClick={() => handleChartClick("Bar")}
            >
              <img src={BarIcon} alt="Bar Icon" className="h-16 w-16" />
              <span>Bar</span>
            </div>
            <div
              className="flex flex-col items-center border border-gray-300 h-fit w-fit px-12 py-2 lg:py-4 rounded-md cursor-pointer"
              onClick={() => handleChartClick("Pie")}
            >
              <img src={PieIcon} alt="Pie Icon" className="h-16 w-16" />
              <span>Pie</span>
            </div>
          </div>
        </div>
      ) : (
        // Input Screen
        <div className="w-full h-full bg-white lg:flex lg:flex-col lg:p-4 lg:sm:p-8 lg:mx-auto">
          <p className="hidden lg:block font-bold break-words">Charts/Graphs</p>
          <button
            type="button"
            className="hidden md:block px-6 py-2 border border-[#8A8B8C] bg-white text-[#797C81] hover:bg-[#F0F0F0] rounded-md transition ml-auto"
            onClick={handleBackClick}
          >
            Back
          </button>
          <h2 className="text-l text-[#091220] w-[17rem] font-light ml-2 mt-4">
            Slide-1
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr className="bg-[#F5F7FA]">
                  <th className="px-4 py-2 text-left">Label</th>
                  <th className="px-4 py-2 text-left">Services</th>
                  {Array.from({ length: series - 1 }).map((_, index) => (
                    <th key={index} className="px-4 py-2 text-left">
                      Series {index + 2}
                    </th>
                  ))}
                  <th className="py-2">
                    <button
                      onClick={addSeries}
                      className="flex items-center px-4 py-2 bg-[#F5F7FA] text-black transition rounded-md"
                    >
                      <FaPlus className="mr-2" /> Add New Series
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.label}
                        placeholder={`Enter data ${rowIndex + 1}`}
                        onChange={(e) =>
                          handleInputChange(rowIndex, "label", e.target.value)
                        }
                        className="border-none border-gray-300 px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.services}
                        placeholder={`Enter data ${rowIndex + 1}`}
                        onChange={(e) =>
                          handleInputChange(rowIndex, "services", e.target.value)
                        }
                        className="border-none border-gray-300 px-2 py-1 rounded w-full"
                      />
                    </td>
                    {Array.from({ length: series - 1 }).map((_, index) => (
                      <td key={index} className="px-4 py-2">
                        <input
                          type="text"
                          placeholder={`Enter data ${rowIndex + 1}`}
                          className="border-none border-gray-300 px-2 py-1 rounded w-full"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={addRow}
              className="flex items-center px-4 py-2 bg-[#E1E3E5] text-[#5D5F61] rounded hover:bg-blue-700 hover:text-white transition"
            >
              <FaPlus className="mr-2" /> Add Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
