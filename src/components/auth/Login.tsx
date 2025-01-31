import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, OAuthProvider } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { jwtDecode } from 'jwt-decode'
import ContentImage from '../../assets/authContentImage.png'
import MicrosoftIcon from '../../assets/ms-login.svg'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { DecodedToken, IpInfoResponse } from '../../types/authTypes'
import { useDispatch } from 'react-redux'
import { setUserPlan } from '../../redux/slices/userSlice'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const defaultAvatarUrl =
    'https://github.com/parati-eos/EOS_DEPLOYMENT/blob/main/download__11_-removebg-preview%20(1).png?raw=true'

  // Function to generate a unique organization ID
  const generateOrgId = () => {
    return 'Parati-' + Date.now()
  }
  const generatedOrgId = generateOrgId()

  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded: DecodedToken = jwtDecode(credentialResponse.credential)
    sessionStorage.setItem('userEmail', decoded.email)
    sessionStorage.setItem('userDP', decoded.picture)

    const userData = {
      name: decoded.name,
      email: decoded.email,
    }

    // Send user data to MongoDB via API
    saveUserData(userData)
  }

  const handleMicrosoftLogin = async () => {
    const provider = new OAuthProvider('microsoft.com')
    try {
      const result = await signInWithPopup(auth, provider)
      if (result && result.user) {
        const userData = {
          name: result.user.displayName || '',
          email: result.user.email || '',
          picture: result.user.photoURL || defaultAvatarUrl,
        }

        saveUserData(userData)
        sessionStorage.setItem('userEmail', userData.email)
        sessionStorage.setItem('userDP', userData.picture)
      } else {
        throw new Error('Microsoft Login Failed: No access token found')
      }
    } catch (error) {
      console.error('Microsoft Login Failed:', error)
    }
  }

  const saveUserData = async (userData: Record<string, any>) => {
    setIsLoading(true)
    const signupLink = localStorage.getItem('sign_up_link') || ''
    try {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      const userPayload = {
        userId: userData.email,
        name: userData.name,
        orgId: generatedOrgId,
        pptCount: 0,
        userIPCountry: ipInfoData.country!,
        signupLink: signupLink,
        signupTime: new Date().toString(),
        latestLogin: new Date().toString(),
      }

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/userprofile/user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userPayload),
        }
      )

      const responseData = await res.json()

      if (responseData.orgid && (responseData.plan !== null || '')) {
        if (responseData.plan.plan_name) {
          dispatch(setUserPlan(responseData.plan.plan_name))
        }
        sessionStorage.setItem('orgId', responseData.orgid)
        navigate('/new-presentation')
      } else if (!responseData.orgId || responseData.plan === null || '') {
        sessionStorage.setItem('orgId', generatedOrgId)
        setIsLoading(false)
        navigate('/onboarding')
      }
      sessionStorage.setItem('authToken', responseData.token)
    } catch (error) {
      setIsLoading(false)
      console.error('Error storing user data:', error)
    }
  }

  return (
    <div className="relative flex flex-col shadow-lg h-screen">
      {isLoading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Background Split */}
          <div className="absolute top-0 left-0 w-full h-3/4 md:h-1/2 bg-[#3667B2]"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/4 md:h-1/2 bg-white"></div>

          <div className="relative flex flex-col md:flex-row justify-center items-center h-full w-full">
            {/* Image Section */}
            <div className="flex justify-center items-center h-[50vh]  md:h-full w-full md:w-1/2 md:px-0">
              <img
                src={ContentImage}
                alt="Auth"
                className="h-full w-full  md:max-h-none object-cover "
                loading="lazy"
              />
            </div>
            {/* Buttons Section */}
            <div className="flex justify-center items-center h-[60vh] md:h-full w-full md:w-1/2 px-6 md:px-12">
              <div className="p-6 bg-transparent border-2 border-[#004264] shadow-lg text-white rounded-lg flex flex-col items-center w-full max-w-md">
                <h1 className="text-2xl md:text-3xl font-bold lg:mb-2 md:mb-4">
                  Login
                </h1>
                <div className="flex flex-col justify-center items-center">
                  <span className="hover:scale-105">
                    <GoogleOAuthProvider clientId="1053104378274-jchabnb9vv91n94l76g97aeuuqmrokt9.apps.googleusercontent.com">
                      <GoogleLogin onSuccess={handleGoogleSuccess} />
                    </GoogleOAuthProvider>
                  </span>
                  <img
                    onClick={handleMicrosoftLogin}
                    src={MicrosoftIcon}
                    alt="Microsoft Login"
                    className="w-full h-full mt-4 hover:cursor-pointer hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Login
