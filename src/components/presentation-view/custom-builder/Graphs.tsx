import React, { useState, useEffect } from 'react'
import { FaPlus, FaChartPie, FaChartLine, FaChartBar } from 'react-icons/fa'
import axios from 'axios'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../ViewPresentation'

interface GraphProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
}

export default function Graphs({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
}: GraphProps) {
  const [currentScreen, setCurrentScreen] = useState<
    'chartSelection' | 'inputScreen'
  >('chartSelection')
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [rows, setRows] = useState(Array.from({ length: 5 }, () => ['']))
  const [columns, setColumns] = useState(['Series 1', 'Series 2'])
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    validateData()
  }, [rows, columns])

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType)
    setCurrentScreen('inputScreen')
    setRows(Array.from({ length: 5 }, () => ['']))
    setColumns(['Series 1', 'Series 2'])
  }

  const addRow = () => {
    if (rows.length < 10) {
      setRows([...rows, Array(columns.length).fill('')])
    } else {
      alert('Maximum of 10 rows can be added.')
    }
  }

  const addSeries = () => {
    if (columns.length < 4) {
      setColumns([...columns, ''])
      setRows(rows.map((row) => [...row, '']))
    } else {
      alert('Maximum of 4 columns allowed.')
    }
  }

  const handleColumnNameChange = (index: number, value: string) => {
    const updatedColumns = [...columns]
    updatedColumns[index] = value
    setColumns(updatedColumns)
  }

  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updatedRows = rows.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell))
        : row
    )
    setRows(updatedRows)
  }

  const validateData = () => {
    const filledCells = rows.filter((row) => row.some((cell) => cell))
    setIsButtonDisabled(filledCells.length < 2)
  }

  const formatPayload = () => {
    const series = columns.map((colName, colIndex) => ({
      key: colName,
      value: rows.map((row) => Number(row[colIndex] || 0)),
    }))

    return {
      type: 'graphs',
      title: heading,
      documentID: documentID,
      data: {
        slideName: heading,
        chartType: selectedChart,
        chart: { series },
      },
    }
  }

  const handleSubmit = async () => {
    try {
      const payload = formatPayload()
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/graphs`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      alert('Submitted successfully!')
    } catch (error) {
      console.error('Submit failed:', error)
      alert('Failed to submit images.')
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Section: Headings */}
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <BackButton onClick={onBack} />
      </div>

      {currentScreen === 'chartSelection' ? (
        <div className="w-full h-full lg:flex lg:flex-col lg:p-4 lg:sm:p-8 ml-2 md:mt-6 lg:mt-10">
          <h2 className="text-base font-normal text-[#5D5F61] w-[17rem]">
            Select chart type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mr-5">
            {['Line', 'Bar', 'Pie'].map((chart) => (
              <div
                key={chart}
                className="flex flex-col items-center border border-gray-300 h-fit w-full px-4 py-2 lg:py-4 rounded-md cursor-pointer"
                onClick={() => handleChartClick(chart)}
              >
                {chart === 'Line' && (
                  <FaChartLine className="h-12 w-12 sm:h-16 sm:w-16 text-[#3667B2]" />
                )}
                {chart === 'Bar' && (
                  <FaChartBar className="h-12 w-12 sm:h-16 sm:w-16 text-green-700" />
                )}
                {chart === 'Pie' && (
                  <FaChartPie className="h-12 w-12 sm:h-16 sm:w-16 text-orange-600" />
                )}
                <span className="text-sm sm:text-base">{chart}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-white lg:flex lg:flex-col lg:p-4 lg:sm:p-8 lg:mx-auto">
          <div className="mt-4 max-h-[50vh] overflow-x-auto overflow-y-auto">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr className="bg-[#F5F7FA]">
                  {columns.map((col, colIndex) => (
                    <th key={colIndex} className="px-4 py-2 text-left">
                      <input
                        type="text"
                        value={col}
                        onChange={(e) =>
                          handleColumnNameChange(colIndex, e.target.value)
                        }
                        placeholder={`Enter Series Name`}
                        className="px-2 py-1 font-medium rounded w-[90%] outline-none placeholder-[#5D5F61] placeholder:font-medium bg-transparent"
                      />
                    </th>
                  ))}
                  <th className="py-2">
                    <button
                      onClick={addSeries}
                      className="flex items-center px-4 py-2 bg-[#F5F7FA] text-black font-medium transition rounded-md"
                    >
                      <FaPlus className="mr-2" /> Add New Series
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="px-4 py-2">
                        <input
                          type="text"
                          value={cell}
                          placeholder={`Enter data ${rowIndex + 1}`}
                          onChange={(e) =>
                            handleInputChange(
                              rowIndex,
                              colIndex,
                              e.target.value
                            )
                          }
                          className="px-2 py-1 rounded w-[90%] outline-none"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4 overflow-y-auto">
            <button
              onClick={addRow}
              className="flex items-center md:ml-2 px-4 py-2 bg-[#E1E3E5] text-[#5D5F61] rounded hover:bg-[#3667B2] hover:text-white transition"
            >
              <FaPlus className="mr-2" /> Add Data
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        className={`absolute bottom-4 right-4 py-2 px-4 rounded-md ${
          isButtonDisabled
            ? 'bg-gray-400 text-gray-200'
            : 'bg-[#3667B2] text-white'
        }`}
      >
        Generate Slide
      </button>
    </div>
  )
}
