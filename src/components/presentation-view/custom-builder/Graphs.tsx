import React, { useState, useEffect, useRef } from 'react'
import { FaPlus, FaChartPie, FaChartLine, FaChartBar } from 'react-icons/fa'
import axios from 'axios'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'

interface GraphProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
}

export default function Graphs({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
}: GraphProps) {
  const [currentScreen, setCurrentScreen] = useState<
    'chartSelection' | 'inputScreen'
  >('chartSelection')
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [rows, setRows] = useState([{ label: '', services: '', series3: '' }])
  const [series, setSeries] = useState(1)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isAddRowDisabled, setIsAddRowDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const [headers, setHeaders] = useState<string[]>(['Series 1', 'Series 2'])

  useEffect(() => {
    const initRows = window.innerWidth < 768 ? 1 : 3
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
      toast.info('Maximum 10 rows can be added')
    }
  }

  useEffect(() => {
    if (tableRef.current) {
      // Ensure smooth scrolling to the bottom when rows are added
      tableRef.current.scrollTo({
        top: tableRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [rows.length])

  const addSeries = () => {
    const maxSeries = selectedChart === 'Pie' ? 1 : 2
    if (series < maxSeries) {
      setSeries(series + 1)
      setHeaders([...headers, `Series ${series + 2}`])
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

  const handleHeaderChange = (index: number, value: string) => {
    const updatedHeaders = headers.map((header, i) =>
      i === index ? value : header
    )
    setHeaders(updatedHeaders)
  }

  const validateData = () => {
    const isRowValid = rows.every((row) => row.label && row.services)
    setIsAddRowDisabled(!isRowValid)
    const filledCells = rows.filter((row) => row.label && row.services)
    setIsButtonDisabled(filledCells.length < 2)
  }

  useEffect(() => {
    validateData()
  }, [rows, series])

  const handleSubmit = async () => {
    if (outlineID === sessionStorage.getItem('newOutlineID')) {
      sessionStorage.removeItem('newOutlineID')
    }
    setIsSlideLoading()
    setIsLoading(true)
    try {
      const seriesData: { key: string; value: string[] }[] = []

      // Transform rows into series data
      headers.forEach((header, index) => {
        const key = header
        const values = rows.map(
          (row) => row[Object.keys(row)[index] as keyof typeof row]
        )
        if (values.some((value) => value !== '')) {
          seriesData.push({ key, value: values })
        }
      })

      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/graphs`,
          {
            type: 'Graphs',
            title: heading,
            documentID: documentID,
            outlineID: outlineID,
            data: {
              chartType: selectedChart!.toLowerCase(),
              slideName: heading,
              chart: {
                series: seriesData,
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          toast.info('Data submitted successfully!', {
            position: 'top-right',
            autoClose: 3000,
          })
          setIsLoading(false)
          setDisplayMode('slides')
        })
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }

  const onBack = () => {
    if (currentScreen === 'chartSelection') {
      setDisplayMode('customBuilder')
    } else if (currentScreen === 'inputScreen') {
      setCurrentScreen('chartSelection')
    }
  }

  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="flex flex-col h-full w-full lg:p-4 p-2 ">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full">
            <h3>Graphs</h3>
            <BackButton onClick={onBack} />
          </div>
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
            {heading}
          </h2>
          {currentScreen === 'chartSelection' ? (
            <div className="w-full h-full flex-row lg:flex-col lg:p-4 lg:sm:p-8 ml-2 mt-2 lg:mt-10">
              <h3 className="text-semibold">Select Graph Type</h3>
              <div className="grid  grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mr-5 h-28 ">
                {['Line', 'Bar', 'Pie'].map((chart) => (
                  <div
                    key={chart}
                    className="flex flex-col items-center justify-center border border-gray-300  w-full h-full px-4 py-2 lg:py-4 rounded-md cursor-pointer"
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
                    <span className="text-lg text-weight-500 sm:text-base">
                      {chart}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full bg-white   overflow-x-auto scrollbar-none">
              <div
                className="mt-4 overflow-y-auto scrollbar-none  "
                ref={tableRef}
              >
                <table className="table-auto border-collapse  w-full">
                  <thead>
                    <tr className="bg-[#F5F7FA]">
                      {headers.map((header, index) => (
                        <th key={index} className="px-2 py-2 text-left lg:px-4">
                          <input
                            type="text"
                            value={header}
                            placeholder={`Series ${index + 1}`}
                            onChange={(e) =>
                              handleHeaderChange(index, e.target.value)
                            }
                            className=" lg:px-2 lg:py-1 font-medium rounded w-[90%] outline-none placeholder-[#5D5F61] placeholder:font-medium bg-transparent"
                          />
                        </th>
                      ))}
                      {series < (selectedChart === 'Pie' ? 1 : 2) && (
                        <th className="py-2">
                          <button
                            onClick={addSeries}
                            className="flex items-center px-4 lg:px-4 lg:py-2 bg-[#F5F7FA] text-black font-medium transition rounded-md"
                          >
                            <FaPlus className="mr-2" />
                            <span className="hidden sm:inline">
                              Add New Series
                            </span>
                            <span className="sm:hidden">Add</span>
                          </button>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="px-2 py-2 lg:px-4 ">
                          <input
                            type="text"
                            value={row.label}
                            placeholder={`Enter Data ${rowIndex + 1}`}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                'label',
                                e.target.value
                              )
                            }
                            className=" lg:px-2 lg:py-1 rounded w-[90%] outline-none"
                          />
                        </td>
                        <td className="px-2 py-2 lg:px-4 ">
                          <input
                            type="text"
                            value={row.services}
                            placeholder={`Enter Data ${rowIndex + 1}`}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                'services',
                                e.target.value
                              )
                            }
                            className=" lg:px-2 lg:py-1rounded w-[90%] outline-none"
                          />
                        </td>
                        {Array.from({ length: series - 1 }).map((_, index) => (
                          <td key={index} className="px-4 py-2">
                            <input
                              type="text"
                              value={
                                row[`series${index + 3}` as keyof typeof row] ||
                                ''
                              }
                              placeholder={`Enter Data ${rowIndex + 1}`}
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
                <div className="flex justify-between lg:mt-4 mt-2  ">
                  <button
                    onClick={addRow}
                    disabled={isAddRowDisabled}
                    className={`flex items-center md:border md:border-gray-300 md:rounded-lg gap-1 md:ml-2 px-2 lg:px-4 py-2 bg-[#E1E3E5] text-[#5D5F61]  transition ${
                      isAddRowDisabled
                        ? 'cursor-not-allowed'
                        : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white'
                    }`}
                  >
                    <FaPlus className="mr-2" /> Add Data
                  </button>
                </div>
              )}
              <div className="hidden mt-auto lg:flex w-full  justify-between lg:justify-end lg:w-auto lg:gap-4 gap-2">
                <button
                  onClick={(e) => {
                    if (!isButtonDisabled) {
                      handleSubmit()
                    } else {
                      e.preventDefault() // Prevent action when disabled
                    }
                  }}
                  onMouseEnter={() => isButtonDisabled && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform  ${
                    isButtonDisabled
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-[#3667B2] text-white'
                  }`}
                >
                  Generate Slide
                  {/* Tooltip */}
                  {isButtonDisabled && showTooltip && (
                    <span className="absolute top-[-35px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                      Minimum 2 Datapoints Required
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Generate Slide Buttons for Mobile */}

          <div className="flex lg:hidden   gap-2  justify-end ">
            <div className="justify-end">
              <div className="relative inline-block">
                <button
                  onClick={(e) => {
                    if (!isButtonDisabled) {
                      handleSubmit()
                    } else {
                      e.preventDefault() // Prevent action when disabled
                    }
                  }}
                  onMouseEnter={() => isButtonDisabled && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`flex-1 py-2 px-5 rounded-md ${
                    isButtonDisabled
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-[#3667B2] text-white'
                  }`}
                >
                  Generate Slide
                  {/* Tooltip */}
                  {isButtonDisabled && showTooltip && (
                    <span className="absolute top-[-45px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                      Minimum Two <br></br> Datapoints Required
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
