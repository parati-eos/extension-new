import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPlus } from 'react-icons/fa'

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
}

export default function Table({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
}: TableProps) {
  const [tableData, setTableData] = useState<TableData>({
    rows: Array(3)
      .fill(null)
      .map(() => Array(3).fill('')), // Deep copy for rows
    columnHeaders: ['Column 1', 'Column 2', 'Column 3'],
    rowHeaders: ['Row 1', 'Row 2', 'Row 3'],
  })
  const [canGenerate, setCanGenerate] = useState(false)

  useEffect(() => {
    // Validate the data to check if at least 2 cells in 2 different rows and columns are filled
    const nonEmptyRows = tableData.rows.filter((row) =>
      row.some((cell) => cell.trim() !== '')
    ).length
    const nonEmptyColumns = tableData.columnHeaders.filter((_, colIndex) =>
      tableData.rows.some((row) => row[colIndex]?.trim() !== '')
    ).length

    setCanGenerate(nonEmptyRows >= 2 && nonEmptyColumns >= 2)
  }, [tableData])

  const handleAddRow = () => {
    if (tableData.rows.length < 9) {
      setTableData((prev) => ({
        ...prev,
        rows: [...prev.rows, Array(prev.columnHeaders.length).fill('')],
        rowHeaders: [...prev.rowHeaders, `Row ${prev.rowHeaders.length + 1}`],
      }))
    }
  }

  const handleAddColumn = () => {
    if (tableData.columnHeaders.length < 6) {
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

  const handleGenerateSlide = async () => {
    try {
      await axios.patch('/api/table-data', tableData) // Replace with your actual API endpoint
      alert('Data successfully sent to the server!')
    } catch (error) {
      console.error('Error sending data:', error)
      alert('Failed to send data.')
    }
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Top Section: Headings */}
      <div className="flex lg:mt-2 items-center justify-between w-full px-4">
        <h2 className="hidden md:block md:text-lg font-semibold text-[#091220]">
          {heading}
        </h2>
        <button className="hidden md:block text-sm border border-[#8A8B8C] px-3 py-1 rounded-lg text-[#5D5F61] hover:underline">
          Back
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 px-4 py-4 overflow-x-auto">
        <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr>
                {/* Empty cell for row headers */}
                <th className="bg-gray-100 p-2"></th>
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
                {/* Add Column Button */}
                <th className="bg-gray-50 p-2">
                  <button
                    onClick={handleAddColumn}
                    className="text-[#8A8B8C] bg-white flex items-center justify-center border border-[#E1E3E5] rounded-full p-1 hover:bg-blue-100"
                  >
                    <FaPlus />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Row Header */}
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
                    <td key={colIndex} className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleCellChange(rowIndex, colIndex, e.target.value)
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
                {/* Add Row Button */}
                <td className="bg-gray-50 w-full p-2 flex items-center justify-center">
                  <button
                    onClick={handleAddRow}
                    className="text-[#8A8B8C] bg-white border border-[#E1E3E5] rounded-full p-1 flex items-center justify-center"
                  >
                    <FaPlus />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Generate Slide Button */}
      <button
        onClick={handleGenerateSlide}
        disabled={!canGenerate}
        className={`absolute bottom-4 right-4 py-2 px-4 rounded-md ${
          canGenerate ? 'bg-[#3667B2] text-white' : 'bg-gray-400 text-gray-200'
        }`}
      >
        Generate Slide
      </button>
    </div>
  )
}
