import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Grid } from 'react-loader-spinner'

interface SlideData {
  id: string
  data: string[]
}

const GoogleslidesShare: React.FC = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const formId: string | null = searchParams.get('formId')

  const [slidesData, setSlidesData] = useState<string[][]>([])
  const [slidesId, setSlidesId] = useState<string>('')
  const [loading, setLoading] = useState<string>('true')

  useEffect(() => {
    const fetchSlidesData = async () => {
      try {
        const serverurl = process.env.REACT_APP_SERVER_URL
        const url = `${serverurl}/slides?&formId=${formId}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch slides data')
        }
        const data: SlideData = await response.json()
        setSlidesId(data.id)
        setSlidesData(data.data)
        if (data.data.length >= 2) {
          setLoading('false')
        }
      } catch (error: any) {
        console.error('Error fetching slides data:', error.message)
      }
    }
    fetchSlidesData()
  }, [formId])

  if (loading === 'true') {
    return (
      <div className="relative top-[30vh] left-[50vh]">
        <Grid
          visible={true}
          height="120"
          width="120"
          color="#E6A500"
          ariaLabel="grid-loading"
          radius="12.5"
        />
      </div>
    )
  }

  try {
    return (
      <div>
        {slidesData.length < 1 ? (
          <div className="text-center text-2xl font-bold text-aliceblue">
            No slides to display
          </div>
        ) : (
          slidesData.map((slideId, index) => (
            <div key={slideId}>
              <iframe
                key={index}
                className="h-[80vh] w-[99%] bg-black border-[2px] border-[#1f516b] pointer-events-none"
                title="Google Slides Embed"
                src={`https://docs.google.com/presentation/d/${slidesId}/embed?rm=minimal&start=false&loop=false&slide=id.${slideId[0]}`}
              ></iframe>
            </div>
          ))
        )}
      </div>
    )
  } catch (error: any) {
    console.error('Error rendering slides:', error)
    return (
      <div className="text-center text-2xl font-bold text-aliceblue">
        Error displaying slides....
      </div>
    )
  }
}

export default GoogleslidesShare
