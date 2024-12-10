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
  const [rows, setRows] = useState([{ label: '', services: '', series3: '' }])
  const [series, setSeries] = useState(1)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    const initRows = window.innerWidth < 768 ? 2 : 3
    setRows(
      Array.from({ length: initRows }, () => ({
        label: '',
        services: '',
        series3: '',
      }))
    )
  }, [])

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType)
    setCurrentScreen('inputScreen')
    const initRows = window.innerWidth < 768 ? 2 : 3
    setRows(
      Array.from({ length: initRows }, () => ({
        label: '',
        services: '',
        series3: '',
      }))
    )
    setSeries(1) // Reset series when selecting a new chart
  }

  const addRow = () => {
    if (rows.length < 10) {
      setRows([...rows, { label: '', services: '', series3: '' }])
    } else {
      alert('Maximum of 10 rows can be added.')
    }
  }

  const addSeries = () => {
    const maxSeries = selectedChart === 'Pie' ? 1 : 2
    if (series < maxSeries) {
      setSeries(series + 1)
    } else {
      alert(
        `Maximum of ${maxSeries} series allowed for ${selectedChart} charts.`
      )
    }
  }

  const handleInputChange = (
    rowIndex: number,
    column: string,
    value: string
  ) => {
    if (column !== 'label' && !/^\d*\.?\d*$/.test(value)) {
      return // Validate numerical input for series fields
    }
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [column]: value } : row
    )
    setRows(updatedRows)
  }

  const validateData = () => {
    const filledCells = rows.filter((row) => row.label && row.services)
    setIsButtonDisabled(filledCells.length < 2)
  }

  useEffect(() => {
    validateData()
  }, [rows, series])

  const handleSubmit = async () => {
    try {
      await axios.post(
        '/api/upload-images',
        { rows, series, selectedChart },
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
      {/* Heading Section */}
      <div className="flex items-center justify-between w-full p-4">
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
        <div className="flex flex-col w-full h-full bg-white lg:p-4 lg:sm:p-8 overflow-x-auto">
          <div className="mt-4 overflow-y-auto max-h-[60vh] p-2 sm:p-4">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr className="bg-[#F5F7FA]">
                  <th className="px-4 py-2 text-left">
                    <input
                      type="text"
                      placeholder="Series 1"
                      className="px-2 py-1 font-medium rounded w-[90%] outline-none placeholder-[#5D5F61] placeholder:font-medium bg-transparent"
                    />
                  </th>
                  <th className="px-4 py-2 text-left">
                    <input
                      type="text"
                      placeholder="Series 2"
                      className="px-2 py-1 font-medium rounded w-[90%] outline-none placeholder-[#5D5F61] placeholder:font-medium bg-transparent"
                    />
                  </th>
                  {Array.from({ length: series - 1 }).map((_, index) => (
                    <th key={index} className="px-4 py-2 text-left">
                      <input
                        type="text"
                        placeholder={`Series ${index + 3}`}
                        className="px-2 py-1 font-medium rounded w-[90%] outline-none placeholder-[#5D5F61] placeholder:font-medium bg-transparent"
                      />
                    </th>
                  ))}
                  {series < (selectedChart === 'Pie' ? 1 : 2) && (
                    <th className="py-2">
                      <button
                        onClick={addSeries}
                        className="flex items-center px-4 py-2 bg-[#F5F7FA] text-black font-medium transition rounded-md"
                      >
                        <FaPlus className="mr-2" /> Add New Series
                      </button>
                    </th>
                  )}
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
                          handleInputChange(rowIndex, 'label', e.target.value)
                        }
                        className="px-2 py-1 rounded w-[90%] outline-none"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.services}
                        placeholder={`Enter data ${rowIndex + 1}`}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            'services',
                            e.target.value
                          )
                        }
                        className="px-2 py-1 rounded w-[90%] outline-none"
                      />
                    </td>
                    {Array.from({ length: series - 1 }).map((_, index) => (
                      <td key={index} className="px-4 py-2">
                        <input
                          type="text"
                          value={
                            row[`series${index + 3}` as keyof typeof row] || ''
                          }
                          placeholder={`Enter data ${rowIndex + 1}`}
                          onChange={(e) =>
                            handleInputChange(
                              rowIndex,
                              `series${index + 3}`,
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
          {rows.length < 10 && (
            <div className="flex justify-between mt-4 p-2">
              <button
                onClick={addRow}
                className="flex items-center md:ml-2 px-4 py-2 bg-[#E1E3E5] text-[#5D5F61] rounded hover:bg-[#3667B2] hover:text-white transition"
              >
                <FaPlus className="mr-2" /> Add Row
              </button>
            </div>
          )}
          <div className="mt-8 w-full flex justify-end">
            <button
              disabled={isButtonDisabled}
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#5D5F61] text-white rounded hover:bg-[#091220] transition disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
