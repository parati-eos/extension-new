import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import '../viewpresentation.css'

interface TableData {
  rows: string[][]
  columnHeaders: string[]
  rowHeaders: string[]
}

interface TableProps {
  heading: string
  slideType: string
  documentID: string
  orgId: string
  authToken: string
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>
  outlineID: string
  setIsSlideLoading: () => void
}

export default function Table({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
}: TableProps) {
  const [tableData, setTableData] = useState<TableData>({
    rows: Array(2)
      .fill(null)
      .map(() => Array(2).fill('')),
    columnHeaders: ['Column 1', 'Column 2'],
    rowHeaders: ['Row 1', 'Row 2'],
  })
  const [canGenerate, setCanGenerate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isRowAdded, setIsRowAdded] = useState(false)

  useEffect(() => {
    // Count fully completed rows
    const completedRows = tableData.rows.filter((row) =>
      row.every((cell) => cell.trim() !== '')
    ).length

    // Count fully completed columns
    const columnCount = tableData.rows[0]?.length || 0
    const completedColumns = Array.from({ length: columnCount }).filter(
      (_, colIndex) =>
        tableData.rows.every((row) => row[colIndex]?.trim() !== '')
    ).length

    // Enable generation only if at least 2 rows and 2 columns are fully completed
    setCanGenerate(completedRows >= 2 && completedColumns >= 2)
  }, [tableData])

  const handleAddRow = () => {
    if (tableData.rows.length < 8) {
      setTableData((prev) => ({
        ...prev,
        rows: [...prev.rows, Array(prev.columnHeaders.length).fill('')],
        rowHeaders: [...prev.rowHeaders, `Row ${prev.rowHeaders.length + 1}`],
      }))
      setIsRowAdded(true) // Trigger scrolling ONLY when adding rows
    }
  }

  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (isRowAdded && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight // Scroll only when a row is added
      setIsRowAdded(false) // Reset the flag to prevent further scrolling
    }
  }, [isRowAdded])

  const handleRemoveRow = () => {
    if (tableData.rows.length > 2) {
      setTableData((prev) => ({
        ...prev,
        rows: prev.rows.slice(0, -1),
        rowHeaders: prev.rowHeaders.slice(0, -1),
      }))
    }
  }

  const handleAddColumn = () => {
    if (tableData.columnHeaders.length < 5) {
      setTableData((prev) => ({
        ...prev,
        columnHeaders: [
          ...prev.columnHeaders,
          `Column ${prev.columnHeaders.length + 1}`,
        ],
        rows: prev.rows.map((row) => [...row, '']),
      }))
    }
  }

  const handleRemoveColumn = () => {
    if (tableData.columnHeaders.length > 2) {
      setTableData((prev) => ({
        ...prev,
        columnHeaders: prev.columnHeaders.slice(0, -1),
        rows: prev.rows.map((row) => row.slice(0, -1)),
      }))
    }
  }

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updatedRows = tableData.rows.map((row, i) =>
      i === rowIndex
        ? row.map((cell, j) => (j === colIndex ? value : cell))
        : row
    )
    setTableData((prev) => ({ ...prev, rows: updatedRows }))
  }

  const handleHeaderChange = (
    index: number,
    value: string,
    isColumn: boolean
  ) => {
    if (isColumn) {
      const updatedHeaders = [...tableData.columnHeaders]
      updatedHeaders[index] = value
      setTableData((prev) => ({ ...prev, columnHeaders: updatedHeaders }))
    } else {
      const updatedHeaders = [...tableData.rowHeaders]
      updatedHeaders[index] = value
      setTableData((prev) => ({ ...prev, rowHeaders: updatedHeaders }))
    }
  }

  const transformRow = (
    row: string[]
  ): {
    attribute1: string
    attribute2: string
    attribute3: string
    attribute4: string
    attribute5: string
  } => {
    return {
      attribute1: row[0] || '',
      attribute2: row[1] || '',
      attribute3: row[2] || '',
      attribute4: row[3] || '',
      attribute5: row[4] || '',
    }
  }

  const handleGenerateSlide = async () => {
    setIsSlideLoading()
    setIsLoading(true)
    // Prepare table data, filtering out empty row and column headers
    const rowHeaders = tableData.rowHeaders.filter((header) => header !== '')
    const columnHeaders = tableData.columnHeaders.filter(
      (header) => header !== ''
    )

    const tablePayload = {
      ...rowHeaders.reduce<Record<string, string>>((acc, header, index) => {
        acc[`rowHeader${index + 1}`] = header
        return acc
      }, {}),
      ...columnHeaders.reduce<Record<string, string>>((acc, header, index) => {
        acc[`columnHeader${index + 1}`] = header
        return acc
      }, {}),
      rows: tableData.rows.map((row, index) => ({
        attribute1: row[0] || '',
        attribute2: row[1] || '',
        attribute3: row[2] || '',
        attribute4: row[3] || '',
        attribute5: row[4] || '',
      })),
    }

    // Filter out empty rows
    const filteredTablePayload = {
      ...tablePayload,
      rows: tablePayload.rows.filter((row) =>
        Object.values(row).some((attr) => attr !== '')
      ),
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/tables`,
        {
          type: 'Tables',
          documentID: documentID,
          outlineID: outlineID,
          data: {
            slideName: heading,
            title: heading,
            ...filteredTablePayload,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
      console.log(response)
      toast.info('Data submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setIsLoading(false)
      setDisplayMode('slides')
    } catch (error) {
      toast.error('Error sending data', {
        position: 'top-right',
        autoClose: 3000,
      })
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col w-full h-full lg:p-4 p-2">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-semibold">Table</h3>
            <BackButton onClick={onBack} />
          </div>
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
            {heading}
          </h2>
          <div
            ref={containerRef}
            className="flex-1 lg:overflow-x-auto overflow-auto scrollbar-none md:p-4 py-2 "
          >
            <div className="lg:overflow-y-auto max-h-[calc(100vh-150px)] w-full overflow-x-auto scrollbar-none">
              <table className="table-auto w-full ">
                <thead>
                  <tr>
                    <th className="bg-gray-100 p-2 lg:w-1/5 lg:min-w-0 min-w-[27vw]">
                      {' '}
                      {/* First Column */}
                      <input
                        type="text"
                        value="Row Headers"
                        className="w-full font-semibold text-center border-none bg-transparent focus:outline-none"
                        readOnly
                      />
                    </th>
                    {tableData.columnHeaders.map((header, index) => (
                      <th
                        key={index}
                        className={`bg-gray-100 lg:p-2 p-1 ${
                          index === 0
                            ? 'lg:min-w-[0vw] min-w-[20vw]'
                            : 'lg:min-w-[0vw] min-w-[22vw]'
                        }`} // Set width for first and other columns
                      >
                        <input
                          type="text"
                          value={header}
                          onChange={(e) =>
                            handleHeaderChange(index, e.target.value, true)
                          }
                          className="w-full font-semibold text-center border-none bg-transparent focus:outline-none"
                        />
                      </th>
                    ))}
                    <th className="bg-gray-50 lg:p-2 p-1 lg:min-w-[0vw] min-w-[10vw]">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleAddColumn}
                          disabled={tableData.columnHeaders.length >= 5}
                          className={`${
                            tableData.columnHeaders.length >= 5
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-[#3667B2]'
                          } bg-white flex items-center justify-center border border-[#E1E3E5] rounded-full p-1 hover:bg-blue-100`}
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={handleRemoveColumn}
                          disabled={tableData.columnHeaders.length <= 2}
                          className={`${
                            tableData.columnHeaders.length <= 2
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-[#3667B2]'
                          } bg-white flex items-center justify-center border border-[#E1E3E5] rounded-full p-1 hover:bg-red-100`}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="bg-gray-100 lg:min-w-[0vw] min-w-[22vw]">
                        <input
                          type="text"
                          value={tableData.rowHeaders[rowIndex]}
                          onChange={(e) =>
                            handleHeaderChange(rowIndex, e.target.value, false)
                          }
                          className="w-full font-medium text-center border-none bg-transparent focus:outline-none"
                        />
                      </td>
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className={`border border-gray-300 p-2 ${
                            colIndex === 0
                              ? 'lg:min-w-[0vw] min-w-[20vw]'
                              : 'lg:min-w-[0vw] min-w-[22vw]'
                          }`}
                        >
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) =>
                              handleCellChange(
                                rowIndex,
                                colIndex,
                                e.target.value
                              )
                            }
                            className="w-full text-center border-none bg-transparent focus:outline-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    {/* Add and Remove Row Buttons */}
                    <td className="bg-gray-50 w-full p-1 flex items-center justify-center lg:min-w-[0vw] min-w-[20vw]">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleAddRow}
                          disabled={tableData.rows.length >= 8}
                          className={`${
                            tableData.rows.length >= 8
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-[#3667B2]'
                          } bg-white flex items-center justify-center border border-[#E1E3E5] rounded-full p-1 hover:bg-blue-100`}
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={handleRemoveRow}
                          disabled={tableData.rows.length <= 2}
                          className={`${
                            tableData.rows.length <= 2
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-[#3667B2]'
                          } bg-white flex items-center justify-center border border-[#E1E3E5] rounded-full p-1 hover:bg-red-100`}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="hidden mt-auto lg:flex w-full  justify-between lg:justify-end lg:w-auto ">
            {/* Generate Slide Button */}
            <button
              onClick={(e) => {
                if (canGenerate) {
                  handleGenerateSlide()
                } else {
                  e.preventDefault() // Prevent action when disabled
                }
              }}
              onMouseEnter={() => !canGenerate && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                canGenerate
                  ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Generate Slide
              {/* Tooltip */}
              {!canGenerate && showTooltip && (
                <span className="absolute top-[-45px] left-1/2 -translate-x-[60%] bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                  Minimum 2 rows and 2 columns required.<br></br> Please fill
                  all cells.
                </span>
              )}
            </button>
          </div>
          {/* Generate Slide Buttons for Mobile */}

          <div className="flex lg:hidden  gap-2 justify-end  ">
            <div className="justify-end">
              <div className="relative inline-block">
                <button
                  onClick={(e) => {
                    if (canGenerate) {
                      handleGenerateSlide()
                    } else {
                      e.preventDefault() // Block action when disabled
                    }
                  }}
                  onMouseEnter={() => !canGenerate && setShowTooltip(true)} // Show tooltip
                  onMouseLeave={() => setShowTooltip(false)} // Hide tooltip
                  className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                    canGenerate
                      ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95' // Enabled styles
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed' // Disabled styles
                  }`}
                >
                  Generate Slide
                </button>

                {/* Tooltip */}
                {!canGenerate && showTooltip && (
                  <span className="absolute top-[-60px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                    Minimum 2 rows and <br></br> 2 columns required.<br></br>{' '}
                    Please fill all cells.
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
