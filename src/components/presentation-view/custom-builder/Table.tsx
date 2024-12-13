import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'

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
}

export default function Table({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
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

  useEffect(() => {
    // Check if there's at least one non-empty cell in any row and any column
    const hasNonEmptyCell = tableData.rows.some((row) =>
      row.some((cell) => cell.trim() !== '')
    )
    setCanGenerate(hasNonEmptyCell)
  }, [tableData])

  const handleAddRow = () => {
    if (tableData.rows.length < 8) {
      setTableData((prev) => ({
        ...prev,
        rows: [...prev.rows, Array(prev.columnHeaders.length).fill('')],
        rowHeaders: [...prev.rowHeaders, `Row ${prev.rowHeaders.length + 1}`],
      }))
    }
  }
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [tableData])

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
    setIsLoading(true)
    try {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/table`,
          {
            type: 'table',
            title: heading,
            documentID: documentID,
            data: {
              slideName: heading,
              rowHeader1: tableData.rowHeaders[0] || '',
              rowHeader2: tableData.rowHeaders[1] || '',
              rowHeader3: tableData.rowHeaders[2] || '',
              rowHeader4: tableData.rowHeaders[3] || '',
              rowHeader5: tableData.rowHeaders[4] || '',
              rowHeader6: tableData.rowHeaders[5] || '',
              rowHeader7: tableData.rowHeaders[6] || '',
              rowHeader8: tableData.rowHeaders[7] || '',
              columnHeader1: tableData.columnHeaders[0] || '',
              columnHeader2: tableData.columnHeaders[1] || '',
              columnHeader3: tableData.columnHeaders[2] || '',
              columnHeader4: tableData.columnHeaders[3] || '',
              columnHeader5: tableData.columnHeaders[4] || '',
              rows1: transformRow(tableData.rows[0] || []),
              rows2: transformRow(tableData.rows[1] || []),
              rows3: transformRow(tableData.rows[2] || []),
              rows4: transformRow(tableData.rows[3] || []),
              rows5: transformRow(tableData.rows[4] || []),
              rows6: transformRow(tableData.rows[5] || []),
              rows7: transformRow(tableData.rows[6] || []),
              rows8: transformRow(tableData.rows[7] || []),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          alert('Data successfully sent to the server!')
          setIsLoading(false)
        })
    } catch (error) {
      console.error('Error sending data:', error)
      alert('Failed to send data.')
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }

  return (
    <div className="flex flex-col w-full h-full p-2">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex lg:mt-2 items-center justify-between w-full px-4">
            <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
              {heading}
            </h2>
            <BackButton onClick={onBack} />
          </div>
          <div ref={containerRef} className="flex-1 px-4 py-4 overflow-x-auto">
            <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-100 p-2 w-1/5"></th>
                    {tableData.columnHeaders.map((header, index) => (
                      <th key={index} className="bg-gray-100 p-2">
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
                    <th className="bg-gray-50 p-2">
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
                      <td className="bg-gray-100">
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
                          className="border border-gray-300 p-2"
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
                    <td className="bg-gray-50 w-full p-2 flex items-center justify-center">
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
          <div className="hidden mt-auto lg:flex w-full px-4 justify-between lg:justify-end lg:w-auto lg:gap-4 gap-2 mb-4 mr-4">
            {/* Generate Slide Button */}
            <button
              onClick={handleGenerateSlide}
              disabled={!canGenerate}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                canGenerate
                  ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              Generate Slide
            </button>
          </div>
          {/* Generate Slide Buttons for Mobile */}

          <div className="flex lg:hidden mt-4 gap-2 justify-end">
            <div className="justify-end">
              <button
                onClick={handleGenerateSlide}
                disabled={!canGenerate}
                className={`flex-1 py-2 px-5 rounded-md text-sm font-medium ${
                  canGenerate
                    ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                Generate Slide
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
