import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './gph.css'
import { Grid } from 'react-loader-spinner'

const GoogleslidesShare = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const formId = searchParams.get('submissionId')
  const [slidesData, setSlidesData] = useState([])
  const [slidesId, setSlidesId] = useState('')
  const [loading, setLoading] = useState('true')

  // In your useEffect, load the data from localStorage before starting the interval
  useEffect(() => {
    const fetchSlidesData = async () => {
      try {
        const serverurl = process.env.REACT_APP_BACKEND_URL
        const url = `https://zynth.ai/api/slides?&formId=${formId}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch slides data')
        }
        const data = await response.json()
        setSlidesId(data.id)
        setSlidesData(data.data)
        if (data.data.length >= 2) {
          setLoading('false')
        }
      } catch (error) {
        console.error('Error fetching slides data:', error.message)
      }
    }
    fetchSlidesData()
  }, [formId])

  if (loading === 'true') {
    return (
      <div className="pitch-loadingIcon">
        <Grid
          visible={true}
          height="120"
          width="120"
          color="#E6A500"
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
        />
      </div>
    )
  }

  try {
    // console.log(slidesData)
    return (
      <div>
        {slidesData.length < 1 ? (
          <div>No slides to display</div>
        ) : (
          slidesData.map((slideId, index) => (
            <div key={slideId}>
              <iframe
                key={index}
                className="pitch-slides-share-iframe"
                title="Google Slides Embed"
                src={`https://docs.google.com/presentation/d/${slidesId}/embed?rm=minimal&start=false&loop=false&slide=id.${slideId[0]}`}
              ></iframe>
            </div>
          ))
        )}
      </div>
    )
  } catch (error) {
    console.error('Error rendering slides:', error)
    return <div className="pitch-error-txt">Error displaying slides....</div>
  }
}

export default GoogleslidesShare
