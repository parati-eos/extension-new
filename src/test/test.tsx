import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

// Replace this with your WebSocket server URL (e.g., http://localhost:5002)
const SOCKET_URL = 'wss://0g7xkfmx-5002.inc1.devtunnels.ms'

const Test = () => {
  const [slides, setSlides] = useState([]) // State to store slide IDs
  const [loading, setLoading] = useState(true) // Loading state

  useEffect(() => {
    // Establish a connection to the socket server
    const socket = io(SOCKET_URL, {
      transports: ['websocket'], // Use WebSocket for faster communication
    })

    console.log('Connecting to WebSocket server...')

    // When connected
    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id)
    })

    // Listen for slide data from the backend
    socket.on('slidesData', (newSlides) => {
      console.log('Received new slide data:', newSlides)
      setSlides(newSlides) // Update the state with new slide data
      setLoading(false) // Stop loading when slides are fetched
    })

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error.message)
      setLoading(false)
    })

    // Automatically fetch slides on component mount
    console.log('Emitting fetchSlides event...')
    socket.emit('fetchSlides', {
      slideType: 'Product Overview',
      formID: 'Document-1732794823300',
    })

    // Cleanup when the component unmounts
    return () => {
      console.log('Disconnecting from WebSocket server...')
      socket.disconnect()
    }
  }, []) // Empty dependency array to run only on mount

  return (
    <div>
      <h1>Slide Display</h1>
      {/* <div>
        {loading ? (
          <p>Loading slides...</p>
        ) : slides.length > 0 ? (
          <ul>
            {slides.map((slideID, index) => (
              <li key={index}>{slideID}</li>
            ))}
          </ul>
        ) : (
          <p>No slides found.</p>
        )}
      </div> */}
    </div>
  )
}

export default Test
