import React, { useState, useEffect } from 'react'
import { Grid } from 'react-loader-spinner'

interface GoogleSlidesProps {
  formId: string
}

const GoogleSlides = ({ formId }: GoogleSlidesProps) => {
  const [slidesData, setSlidesData] = useState<string[]>([])
  const [presentationID, setPresentationID] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const authToken = sessionStorage.getItem('authToken')

  useEffect(() => {
    const fetchSlidesData = async () => {
      try {
        const serverurl = process.env.REACT_APP_BACKEND_URL
        const url = `${serverurl}/api/v1/data/slidedisplay/genSlideIDs/${formId}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch slides data')
        }
        const data = await response.json()
        setPresentationID(data.presentationID)
        setSlidesData(data.genSlideIDs)
        setLoading(false)
      } catch (error: any) {
        console.error('Error fetching slides data:', error.message)
      }
    }
    fetchSlidesData()
  }, [formId, authToken])

  if (loading) {
    return (
      <div className="relative top-[30vh] left-[56vh]">
        <Grid
          visible={true}
          height="120"
          width="120"
          color="#3667B2"
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
                className="h-[80vh] w-[100%] bg-black border-[2px] border-[#3667B2]
                mb-2 pointer-events-none"
                title={`Google Slide ${index + 1}`}
                src={`https://docs.google.com/presentation/d/${presentationID}/embed?rm=minimal&start=false&loop=false&slide=id.${slideId}`}
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

export default GoogleSlides
