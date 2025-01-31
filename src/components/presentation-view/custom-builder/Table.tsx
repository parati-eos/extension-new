import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { BackButton } from './shared/BackButton'
import { DisplayMode } from '../../../types/presentationView'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import '../viewpresentation.css'

interface TableData {
  rows: string[][]
  columnHeaders: string[]
  rowHeaders: string[]
}
type focusedIndex = { rowIndex: number; colIndex: number } | null
interface TableProps {
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

export default function Table({
  heading,
  slideType,
  documentID,
  orgId,
  authToken,
  setDisplayMode,
  outlineID,
  setIsSlideLoading,
  setFailed,
}: TableProps) {
  const [tableData, setTableData] = useState<TableData>({
    rows: Array(2)
      .fill(null)
      .map(() => Array(2).fill('')),
    columnHeaders: ['', ''],
    rowHeaders: ['', ''],
  })
  const [canGenerate, setCanGenerate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isRowAdded, setIsRowAdded] = useState(false)
  const [slideTitle, setSlideTitle] = useState('') // Local state for slide title
  const [refineLoadingSlideTitle, setRefineLoadingSlideTitle] = useState(false) // State for slideTitle loader
  const [refineLoadingTable, setRefineLoadingTable] = useState(false)

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
        rowHeaders: [...prev.rowHeaders, ''], // Use an empty string for placeholder
      }))
      setIsRowAdded(true) // Trigger scrolling ONLY when adding rows
    }
  }
  useEffect(() => {
    // Check if all mandatory fields (minimum 2 rows and 2 columns) are filled
    const areMandatoryFieldsFilled =
      tableData.columnHeaders.length >= 2 &&
      tableData.rowHeaders.length >= 2 &&
      tableData.columnHeaders
        .slice(0, 2)
        .every((header) => header.trim() !== '') &&
      tableData.rowHeaders.slice(0, 2).every((header) => header.trim() !== '')

    // Check if all rendered fields (headers and table cells) are filled
    const areAllFieldsFilled =
      tableData.columnHeaders.every((header) => header.trim() !== '') &&
      tableData.rowHeaders.every((header) => header.trim() !== '') &&
      tableData.rows.every((row) => row.every((cell) => cell.trim() !== ''))

    // Enable generation only if both conditions are met
    setCanGenerate(areMandatoryFieldsFilled && areAllFieldsFilled)
  }, [tableData])

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
        columnHeaders: [...prev.columnHeaders, ''], // Use an empty string for placeholder
        rows: prev.rows.map((row) => [...row, '']), // Add empty cell for the new column
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

  const [focusedIndex, setFocusedIndex] = useState<focusedIndex>(null)

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    // Limit the character count to 25
    const updatedValue = value.slice(0, 25)

    // Update the table data with the new value
    const updatedRows = tableData.rows.map((row, i) =>
      i === rowIndex
        ? row.map((cell, j) => (j === colIndex ? updatedValue : cell))
        : row
    )

    // Update the state with the modified rows
    setTableData((prev) => ({ ...prev, rows: updatedRows }))
  }

  const handleHeaderChange = (
    index: number,
    value: string,
    isColumn: boolean
  ) => {
    // Check if the value exceeds 25 characters
    if (value.length > 25) {
      // Optionally show a validation message or return early if the character count exceeds 25

      return // Stop the update if character count is exceeded
    }

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
      ...tableData.rows.reduce<Record<string, Record<string, string>>>(
        (acc, row, index) => {
          acc[`rows${index + 1}`] = {
            attribute1: row[0] || '',
            attribute2: row[1] || '',
            attribute3: row[2] || '',
            attribute4: row[3] || '',
            attribute5: row[4] || '',
          }
          return acc
        },
        {}
      ),
    }

    // Filter out empty rows
    const filteredTablePayload = Object.fromEntries(
      Object.entries(tablePayload).filter(([key, value]) => {
        if (key.startsWith('rows')) {
          return Object.values(value as Record<string, string>).some(
            (attr) => attr !== ''
          )
        }
        return true
      })
    )

    try {
      const response = await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/generate-document/${orgId}/tables`,
          {
            type: 'Tables',
            documentID: documentID,
            outlineID: outlineID,
            data: {
              slideName: heading,
              title: slideTitle,
              ...filteredTablePayload,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((res) => {
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
  const refineText = async (type: string, text?: string) => {
    let payload

    if (type === 'slideTitle') {
      setRefineLoadingSlideTitle(true)
      payload = text
    } else if (type === 'tables') {
      setRefineLoadingTable(true)

      const rowHeaders = tableData.rowHeaders.map((header) => header || '')
      const columnHeaders = tableData.columnHeaders.map(
        (header) => header || ''
      )

      const tablePayload = {
        ...rowHeaders.reduce<Record<string, string>>((acc, header, index) => {
          acc[`rowHeader${index + 1}`] = header
          return acc
        }, {}),
        ...columnHeaders.reduce<Record<string, string>>(
          (acc, header, index) => {
            acc[`columnHeader${index + 1}`] = header
            return acc
          },
          {}
        ),
        rows: tableData.rows.map((row) => ({
          attribute1: row[0] || '',
          attribute2: row[1] || '',
          attribute3: row[2] || '',
          attribute4: row[3] || '',
          attribute5: row[4] || '',
        })),
      }

      payload = tablePayload
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/refineText`,
        {
          type: type,
          textToRefine: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (response.status === 200 && type === 'slideTitle') {
        setSlideTitle(response.data.refinedText)
        setRefineLoadingSlideTitle(false)
      } else if (response.status === 200 && type === 'tables') {
        setRefineLoadingTable(false)
        const refinedTableData = response.data.refinedtext

        // Extract row headers
        const refinedRowHeaders = Object.keys(refinedTableData)
          .filter((key) => key.startsWith('rowHeader'))
          .sort(
            (a, b) =>
              parseInt(a.replace('rowHeader', ''), 10) -
              parseInt(b.replace('rowHeader', ''), 10)
          )
          .map((key) => refinedTableData[key] || '')

        // Extract and filter column headers
        const refinedColumnHeaders = Object.keys(refinedTableData)
          .filter(
            (key) => key.startsWith('columnHeader') && key !== 'columnHeader0'
          )
          .sort(
            (a, b) =>
              parseInt(a.replace('columnHeader', ''), 10) -
              parseInt(b.replace('columnHeader', ''), 10)
          )
          .map((key) => refinedTableData[key] || '')

        // Determine maxAttributes dynamically based on non-empty column headers
        let maxAttributes = refinedColumnHeaders.filter(
          (header) => header !== ''
        ).length

        // Ensure at least 2 columns are always shown
        maxAttributes = Math.max(maxAttributes, 2)

        // Extract rows dynamically
        const refinedRows = Object.keys(refinedTableData)
          .filter((key) => key.startsWith('rows'))
          .sort(
            (a, b) =>
              parseInt(a.replace('rows', ''), 10) -
              parseInt(b.replace('rows', ''), 10)
          )
          .map((key) => {
            const row = refinedTableData[key] || {}
            return [
              row['attribute1'] || '',
              row['attribute2'] || '',
              row['attribute3'] || '',
              row['attribute4'] || '',
              row['attribute5'] || '',
            ]
          })

        // Trim rows based on maxAttributes
        const trimmedRows = refinedRows.map((row) =>
          row.slice(0, maxAttributes)
        )

        // Ensure at least 2 rows with at least 2 attributes (even if empty)
        while (trimmedRows.length < 2) {
          trimmedRows.push(Array(maxAttributes).fill(''))
        }

        // Ensure at least 2 column headers exist
        while (refinedColumnHeaders.length < 2) {
          refinedColumnHeaders.push('')
        }

        // Update state
        setTableData((prevData) => ({
          ...prevData,
          rowHeaders:
            refinedRowHeaders.length > 0 ? refinedRowHeaders : ['', ''],
          columnHeaders: refinedColumnHeaders.slice(0, maxAttributes),
          rows: trimmedRows,
        }))
      }
    } catch (error) {
      toast.error('Error refining text!', {
        position: 'top-right',
        autoClose: 3000,
      })
      setRefineLoadingSlideTitle(false)
      setRefineLoadingTable(false)
    }
  }

  const onBack = () => {
    setDisplayMode('customBuilder')
  }
  const fetchSlideData = async () => {
    const payload = {
      type: 'Tables',
      title: slideTitle,
      documentID,
      outlineID,
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/slidecustom/fetch-document/${orgId}/tables`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )

      if (response.status === 200) {
        const slideData = response.data;
  
        if (slideData.title) setSlideTitle(slideData.title);
  
        // Extract row headers dynamically
        const rowHeaders = Object.keys(slideData)
          .filter((key) => key.startsWith('rowHeader'))
          .map((key) => slideData[key]?.trim())
          .filter((header) => header && header !== '')

        // Extract column headers dynamically
        const columnHeaders = Object.keys(slideData)
          .filter((key) => key.startsWith('columnHeader'))
          .map((key) => slideData[key]?.trim())
          .filter((header) => header && header !== '')

        // Extract rows dynamically
        const rowsData = Object.keys(slideData)
          .filter((key) => key.startsWith('rows'))
          .map((key) => slideData[key])

        const rows = rowsData
          .map((row) =>
            row
              ? Object.values(row).map((cell) =>
                  typeof cell === 'string' && cell.trim() !== '' ? cell : null
                )
              : []
          )
          .filter((row) => row.some((cell) => cell !== null))

        // Set table data
        setTableData({
          rowHeaders,
          columnHeaders,
          rows: rows.map(
            (row) => row.filter((cell) => cell !== null) as string[]
          ),
        })
      }
    } catch (error) {
      console.error('Error fetching slide data:', error)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    fetchSlideData()
  }, [documentID, outlineID, orgId])

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
          <div className="w-full p-1">
            <div className="relative">
              <input
                type="text"
                value={slideTitle}
                onChange={(e) => setSlideTitle(e.target.value)}
                onFocus={(e) => {
                  const input = e.target as HTMLInputElement // Explicitly cast EventTarget to HTMLInputElement
                  input.scrollLeft = input.scrollWidth // Scroll to the end on focus
                }}
                style={{
                  textOverflow: 'ellipsis', // Truncate text with dots
                  whiteSpace: 'nowrap', // Prevent text wrapping
                  overflow: 'hidden', // Hide overflowing text
                }}
                maxLength={25}
                placeholder="Add Slide Title"
                className="border w-full mt-2 text-[#091220] md:text-lg rounded-md font-semibold bg-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-ellipsis overflow-hidden whitespace-nowrap pr-10"
              />
              <div className="absolute top-[55%] right-2 transform -translate-y-1/2 flex items-center justify-end">
                {refineLoadingSlideTitle ? (
                  <div className="w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                ) : (
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
                )}
              </div>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex-1 lg:overflow-x-auto overflow-auto scrollbar-none md:p-1 p-1 "
          >
            <div className="lg:overflow-y-auto max-h-[calc(100vh-150px)] w-full overflow-x-auto scrollbar-none">
              <table className="table-auto w-full  ">
                <thead>
                  <tr>
                    <th className="bg-gray-100 p-2 lg:w-max overflow-x-auto ">
                      {' '}
                      {/* First Column */}
                      <input
                        type="text"
                        className="w-full font-semibold text-center border-none bg-transparent focus:outline-none"
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
                          placeholder={`Enter Column ${index + 1}`} // Dynamic placeholder
                          onChange={(e) =>
                            handleHeaderChange(index, e.target.value, true)
                          }
                          className="hidden lg:block w-full font-semibold text-center border-none bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={header}
                          placeholder={`Column ${index + 1}`} // Dynamic placeholder
                          onChange={(e) =>
                            handleHeaderChange(index, e.target.value, true)
                          }
                          className="lg:hidden w-full font-semibold text-center border-none bg-transparent focus:outline-none"
                        />
                      </th>
                    ))}
                    <th className="bg-gray-50 lg:p-2 p-1 lg:min-w-[0vw] min-w-[10vw]">
                      <div className="flex justify-center gap-2 ">
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
                        {refineLoadingTable ? (
                          <div className="relative group ml-1 flex items-center justify-center">
                            <div className="absolute w-4 h-4 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <div className="relative group ml-1">
                            <FontAwesomeIcon
                              icon={faWandMagicSparkles}
                              onClick={() => refineText('tables')}
                              className="hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3667B2]"
                            />
                            {/* Tooltip */}
                            <span className="absolute top-[-35px] right-0 bg-black w-max text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
                              Click to refine table.
                            </span>
                          </div>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="bg-gray-100 lg:min-w-[0vw] overflow-x-auto ">
                        <input
                          type="text"
                          value={tableData.rowHeaders[rowIndex]}
                          placeholder={`Enter Row ${rowIndex + 1}`} // Dynamic placeholder
                          onChange={(e) =>
                            handleHeaderChange(rowIndex, e.target.value, false)
                          }
                          className="hidden lg:block w-full font-medium text-center border-none bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={tableData.rowHeaders[rowIndex]}
                          placeholder={`Row ${rowIndex + 1}`} // Dynamic placeholder
                          onChange={(e) =>
                            handleHeaderChange(rowIndex, e.target.value, false)
                          }
                          className="lg:hidden w-full font-medium text-center border-none bg-transparent focus:outline-none"
                        />
                      </td>
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className={`border border-gray-300 p-2 ${
                            colIndex === 0
                              ? 'lg:min-w-[0vw] '
                              : 'lg:min-w-[0vw] '
                          }`}
                        >
                          <div className="relative">
                            <input
                              type="text"
                              value={cell}
                              onFocus={() =>
                                setFocusedIndex({ rowIndex, colIndex })
                              }
                              onBlur={() => setFocusedIndex(null)}
                              onChange={(e) =>
                                handleCellChange(
                                  rowIndex,
                                  colIndex,
                                  e.target.value
                                )
                              }
                              className="w-full text-start border-none bg-transparent focus:outline-none"
                            />
                            {/* Display character count */}
                            {focusedIndex &&
                              focusedIndex.rowIndex === rowIndex &&
                              focusedIndex.colIndex === colIndex && (
                                <span className="absolute bottom-[-10px] right-0 text-xs text-gray-600">
                                  {cell.length}/25
                                </span>
                              )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    {/* Add and Remove Row Buttons */}
                    <td className="bg-gray-50 w-full p-1 flex items-center justify-center lg:min-w-[0vw] ">
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
          <div className="hidden  mt-auto lg:flex w-full  justify-between lg:justify-end lg:w-auto">
            {/* Generate Slide Button */}
            <button
              onClick={(e) => {
                if (canGenerate && slideTitle) {
                  handleGenerateSlide()
                } else {
                  e.preventDefault() // Prevent action when disabled
                }
              }}
              onMouseEnter={() => {
                if (!slideTitle || !canGenerate) setShowTooltip(true)
              }}
              onMouseLeave={() => setShowTooltip(false)}
              className={`flex-1 lg:flex-none lg:w-[180px] py-2 rounded-md transition-all duration-200 transform ${
                canGenerate && slideTitle
                  ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Generate Slide
              {/* Tooltip for table validation */}
              {!canGenerate && showTooltip && (
                <span className="absolute top-[-45px] left-1/2 -translate-x-[60%] bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                  Minimum 2 rows and 2 columns required.
                  <br /> Please fill all cells & headers.
                </span>
              )}
              {/* Tooltip for missing slide title */}
              {!canGenerate ||
                (!slideTitle && showTooltip && (
                  <span className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                    Slide title is required.
                  </span>
                ))}
            </button>
          </div>
          {/* Generate Slide Buttons for Mobile */}
          <div className="flex lg:hidden gap-2 justify-end">
            <div className="justify-end">
              <div className="relative inline-block">
                <button
                  onClick={(e) => {
                    if (canGenerate && slideTitle) {
                      handleGenerateSlide()
                    } else {
                      e.preventDefault() // Prevent action when disabled
                    }
                  }}
                  onMouseEnter={() => {
                    if (!slideTitle || !canGenerate) setShowTooltip(true)
                  }}
                  onMouseLeave={() => setShowTooltip(false)}
                  className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
                    canGenerate && slideTitle
                      ? 'bg-[#3667B2] text-white hover:bg-[#2c56a0] hover:shadow-lg active:scale-95' // Enabled styles
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed' // Disabled styles
                  }`}
                >
                  Generate Slide
                </button>

                {/* Tooltip for table validation */}
                {!canGenerate && showTooltip && (
                  <span className="absolute top-[-45px] left-1/2 -translate-x-[60%] bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                    Minimum 2 rows and 2 columns required.
                    <br /> Please fill all cells & headers.
                  </span>
                )}

                {/* Tooltip for missing slide title */}
                {!canGenerate ||
                  (!slideTitle && showTooltip && (
                    <span className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-10">
                      Slide title is required.
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
