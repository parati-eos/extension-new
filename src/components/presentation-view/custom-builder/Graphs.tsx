import React, { useState, useEffect, useRef } from 'react'
import { FaPlus, FaChartPie, FaChartLine, FaChartBar, FaMinus } from 'react-icons/fa'
import axios from 'axios'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

interface GraphProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
  setFailed: () => void
}

interface Row {
  label: string
  services: string
  series3: string
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
  setFailed,
}: GraphProps) {
  const [currentScreen, setCurrentScreen] = useState<
    'chartSelection' | 'inputScreen'
  >('chartSelection')
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [isInitialDataLoad, setIsInitialDataLoad] = useState(true)
  const [rows, setRows] = useState([{ label: '', services: '', series3: '' }])
  const [series, setSeries] = useState(1)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isAddRowDisabled, setIsAddRowDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const [headers, setHeaders] = useState<string[]>(['', ''])
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false) // State for slideTitle loader

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
      setIsInitialDataLoad(false) // Ensure we scroll to bottom for new points
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
      setHeaders([...headers, ''])
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
    if (value.length > 25) return // Enforce max length of 25 characters

    if (column !== 'label' && !/^\d*\.?\d*$/.test(value)) {
      return // Validate numerical input for series fields
    }
    const updatedRows = rows.map((row, index) =>
      index === rowIndex ? { ...row, [column]: value } : row
    )
    setRows(updatedRows)
  }

  const handleHeaderChange = (index: number, value: string) => {
    if (value.length > 25) return // Enforce max length of 25 characters

    const updatedHeaders = headers.map((header, i) =>
      i === index ? value : header
    )
    setHeaders(updatedHeaders)
  }

  const handleSubmit = async () => {
    toast.info(`Request sent to a generate new version for ${heading}`, {
      position: 'top-right',
      autoClose: 3000,
    })
    const storedOutlineIDs = sessionStorage.getItem('outlineIDs')
    if (storedOutlineIDs) {
      const outlineIDs = JSON.parse(storedOutlineIDs)

      // Check if currentOutlineID exists in the array
      if (outlineIDs.includes(outlineID)) {
        // Remove currentOutlineID from the array
        const updatedOutlineIDs = outlineIDs.filter(
          (id: string) => id !== outlineID
        )

        // Update the sessionStorage with the modified array
        sessionStorage.setItem('outlineIDs', JSON.stringify(updatedOutlineIDs))
      }
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
            title: slideTitle,
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
          toast.info(`Data submitted successfully for ${heading}`, {
            position: 'top-right',
            autoClose: 3000,
          })
          setIsLoading(false)
          setDisplayMode('slides')
        })
    } catch (error) {
      toast.error('Error submitting data!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setFailed()
    }
  }

  const refineText = async (type: string, text: string) => {
    setRefineLoadingSlideTitle(true) // Set loader state to true when refining slideTitle

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/refineText`,
        {
          type: type,
          textToRefine: text,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      if (response.status === 200) {
        const refinedText = response.data.refinedText

        setSlideTitle(refinedText)
      }
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
    } catch (error) {
      toast.error('Error refining text!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setRefineLoadingSlideTitle(false) // Set slideTitle loading state back to false
    }
  }

  const onBack = () => {
    if (currentScreen === 'chartSelection') {
      setDisplayMode('customBuilder');
    } else if (currentScreen === 'inputScreen') {
      setCurrentScreen('chartSelection');
      setSelectedChart(''); // Reset selectedChart to trigger useEffect on back
      setSeries(1); // Reset series to default
      setHeaders(['', '']); // Reset headers
    }
  };
// Modified useEffect for scroll behavior
useEffect(() => {
  if (tableRef.current) {
    if (isInitialDataLoad) {
      // For initial data load, scroll to top
      requestAnimationFrame(() => {
        tableRef.current?.scrollTo({
          top: 0,
          behavior: 'instant',
        })
      })
    }
  }
}, [rows,isInitialDataLoad])
  const [showTooltip, setShowTooltip] = useState(false)
  const removeLastRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1)); // Removes the last row
    }
  };
  
  const [slideTitle, setSlideTitle] = useState('') // Local state for slide title
  const [tooltipMessage, setTooltipMessage] = useState<JSX.Element | null>(null)

  const validateData = () => {
    const isSlideTitleValid = slideTitle && slideTitle.trim() !== '' // Ensure slideTitle is valid
    const isSlideTypeValid = slideType && slideType.trim() !== '' // Ensure slideType is valid

    // Check if Series 1 and Series 2 headers are filled
    const areHeadersValid =
      headers[0] &&
      headers[0].trim() !== '' &&
      headers[1] &&
      headers[1].trim() !== ''

    // Check if required fields in rows are filled
    const isRowValid = rows.every(
      (row) => row.label.trim() !== '' && row.services.trim() !== ''
    )

    setIsAddRowDisabled(!isRowValid) // Enable/disable Add Row button

    const filledCells = rows.filter((row) => row.label && row.services)
    const hasMinimumRows = filledCells.length >= 2 // Ensure at least two rows are filled

    // Update button disabled state based on all validations
    setIsButtonDisabled(
      !(
        isSlideTitleValid &&
        isSlideTypeValid &&
        hasMinimumRows &&
        areHeadersValid
      )
    )

    // Set tooltip message based on validation
    if (!areHeadersValid) {
      setTooltipMessage(
        <>
          Enter Series 1 and
          <br />
          Series 2 placeholders.
        </>
      )
    } else if (!hasMinimumRows) {
      setTooltipMessage(<span>Minimum 2 Datapoints Required.</span>)
    } else if (!isSlideTitleValid) {
      setTooltipMessage(<span>Slide title is required.</span>)
    } else {
      setTooltipMessage(null) // No message if all is valid
    }
  }

  useEffect(() => {
    validateData()
  }, [slideTitle, slideType, rows, series, headers])
  const fetchSlideData = async () => {
    const payload = {
        type: "Graphs",
        title: slideTitle,
        documentID,
        outlineID,
    };

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/graphs`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (response.status === 200) {
            const { chartType, chart, slideName } = response.data;

            // Ensure that chart type is compared correctly (case-insensitive comparison)
            if (selectedChart && selectedChart.toLowerCase() !== chartType.toLowerCase()) {
                console.log(`Chart type mismatch: selected(${selectedChart}) vs response(${chartType})`);
                return; // Exit if the chart types don't match
            }
            const slideData = response.data;
            setIsInitialDataLoad(true) 

            // If the chart types match, update the slide title and other states
            if (slideName && slideName !== slideData.title) {
                setSlideTitle(slideData.title);
            }

            // Update the selected chart if it's different from the response
            if (selectedChart !== chartType.charAt(0).toUpperCase() + chartType.slice(1)) {
                setSelectedChart(chartType.charAt(0).toUpperCase() + chartType.slice(1));
            }

            // Extract headers and set them
            const headers: string[] = chart.series.map((s: { key: string }) => s.key);
            setHeaders(headers);

            // Get the max number of rows from the longest series
            const maxRows: number = Math.max(...chart.series.map((s: { key: string; value: string[] }) => s.value.length));

            // Dynamically create rows based on max rows
            const rowsData: Row[] = Array.from({ length: maxRows }, (_, rowIndex) => {
                const row: Row = {
                    label: "",
                    services: "",
                    series3: "",
                };

                interface Series {
                  key: string;
                  value: string[];
                }

                interface Chart {
                  series: Series[];
                }

                interface SlideData {
                  chartType: string;
                  chart: Chart;
                  slideName: string;
                }

                chart.series.forEach((series: Series, index: number) => {
                  if (index === 0) row.label = series.value[rowIndex] || "";
                  else if (index === 1) row.services = series.value[rowIndex] || "";
                  else if (index === 2) row.series3 = series.value[rowIndex] || "";
                });

                return row;
            });

            // Update rows and series count without affecting other states
            setRows(rowsData.map((row) => ({ ...row, series3: row.series3 || "" })));
            setSeries(chart.series.length - 1); // Subtract 1 from the number of series
        }
    } catch (error) {
      setIsInitialDataLoad(false) // Ensure we scroll to bottom for new points
        console.error("Error fetching slide data:", error);
    }
};

  
  




useEffect(() => {
  if (selectedChart) {
      fetchSlideData();
  }
}, [documentID, outlineID, orgId, selectedChart
]);

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
          {/* Editable Slide Title */}
          {currentScreen === 'inputScreen' && (
            <div className="w-full lg:p-1">
              <div className="relative">
                <input
                  type="text"
                  value={slideTitle}
                  maxLength={50}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="Add Slide Title"
                  onFocus={(e) => {
                    const input = e.target as HTMLInputElement // Explicitly cast EventTarget to HTMLInputElement
                    input.scrollLeft = input.scrollWidth // Scroll to the end on focus
                  }}
                  style={{
                    textOverflow: 'ellipsis', // Truncate text with dots
                    whiteSpace: 'nowrap', // Prevent text wrapping
                    overflow: 'hidden', // Hide overflowing text
                  }}
                  className="border w-full mt-2 text-[#091220] md:text-lg rounded-md font-semibold bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis overflow-hidden whitespace-nowrap pr-10"
                />
                {refineLoadingSlideTitle ? (
                  <div className="absolute top-[55%] right-2 transform -translate-y-1/2 w-full h-full flex items-center justify-end">
                    <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  slideTitle.length>0 &&(
                  <div className="absolute top-[55%] right-2 transform -translate-y-1/2">
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faWandMagicSparkles}
                        onClick={() => refineText('slideTitle', slideTitle)}
                        className="hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3667B2]"
                      />
                      {/* Tooltip */}
                      <span className="absolute top-[-35px] right-0 bg-black w-max text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                        Click to refine text.
                      </span>
                    </div>
                  </div>
                  )
                )}
              </div>
            </div>
          )}
          {currentScreen === 'chartSelection' ? (
            <div     className="w-full h-full flex-row lg:flex-col  lg:ml-1 ml-2 mt-2 ">
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
            <div 
           
            className="flex flex-col w-full h-full bg-white   overflow-x-auto scrollbar-none lg:p-1">
              <div
                className="mt-4 overflow-y-auto scrollbar-none  "
                ref={tableRef}
              >
                <table className="table-auto border-collapse overflow-x-auto  w-full">
                  <thead>
                    <tr className="bg-[#F5F7FA]">
                      {headers.map((header, index) => (
                        <th key={index} className="px-2 py-2 text-left lg:px-4">
                          <input
                            type="text"
                            value={header}
                            placeholder={`Enter Series ${index + 1}`}
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
                <>
                <div className="flex justify-between lg:mt-4 mt-2  ">
                  <button
                    onClick={addRow}
                    disabled={isAddRowDisabled}
                    className={`flex items-center w-[40%] lg:w-[18%] md:border md:border-gray-300 md:rounded-lg gap-1 md:ml-2 px-2 lg:px-4 py-2 bg-[#E1E3E5] text-[#5D5F61]  transition ${
                      isAddRowDisabled
                        ? 'cursor-not-allowed'
                        : 'bg-white text-[#5D5F61] hover:bg-[#3667B2] hover:text-white'
                    }`}
                  >
                    <FaPlus className="mr-2" /> Add Data
                  </button>
                </div>
                <div className="flex justify-between lg:mt-4 mt-2">
  <button
    onClick={removeLastRow}
    disabled={rows.length <= 3} // Prevents removal if only 1 row remains
    className={`flex items-center w-[40%] lg:w-[18%] md:border md:border-gray-300 md:rounded-lg gap-1 md:ml-2 px-2 lg:px-4 py-2 bg-[#E1E3E5] text-[#5D5F61] transition ${
      rows.length <= 3
        ? 'cursor-not-allowed'
        : 'bg-white text-[#5D5F61] hover:bg-red-500 hover:text-white'
    }`}
  >
    <FaMinus className="mr-2" /> Remove Data
  </button>
</div>
</>
              )}
              <div className="hidden mt-auto lg:flex w-full justify-between lg:justify-end lg:w-auto lg:gap-4 gap-2">
                <button
                  onClick={(e) => {
                    if (!isButtonDisabled) {
                      handleSubmit()
                    } else {
                      e.preventDefault() // Prevent action when disabled
                    }
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                    isButtonDisabled
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-[#3667B2] text-white'
                  }`}
                >
                  Generate Slide
                  {/* Tooltip */}
                  {isButtonDisabled && showTooltip && tooltipMessage && (
                    <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                      {tooltipMessage}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Generate Slide Buttons for Mobile */}
          {currentScreen === 'inputScreen' && (
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
                    onMouseEnter={() =>
                      isButtonDisabled && setShowTooltip(true)
                    }
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`flex-1 py-2 px-5 rounded-md ${
                      isButtonDisabled
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-[#3667B2] text-white'
                    }`}
                  >
                    Generate Slide
                    {/* Tooltip */}
                    {isButtonDisabled && showTooltip && tooltipMessage && (
                      <span className="absolute top-[-45px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                        {tooltipMessage}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
