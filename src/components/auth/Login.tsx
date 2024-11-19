import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, OAuthProvider } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { jwtDecode } from 'jwt-decode'
import ContentImage from '../../assets/authContentImage.png'
import MicrosoftIcon from '../../assets/ms-login.svg'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

type DecodedToken = {
  email: string
  picture: string
  name: string
}

function Login() {
  const navigate = useNavigate()
  const defaultAvatarUrl =
    'https://github.com/parati-eos/EOS_DEPLOYMENT/blob/main/download__11_-removebg-preview%20(1).png?raw=true'

  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded: DecodedToken = jwtDecode(credentialResponse.credential)
    localStorage.setItem('userEmail', decoded.email)
    localStorage.setItem('userDP', decoded.picture)

    const userData = {
      name: decoded.name,
      email: decoded.email,
    }

    // Send user data to MongoDB via API
    saveUserData(userData)

    // Redirect to /onboarding if new user, else redirect to /organization-profile if existing user
    navigate('/onboarding')
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

        localStorage.setItem('userEmail', userData.email)
        localStorage.setItem('userDP', userData.picture)

        // Redirect to success page upon successful login
        navigate('/applicationLanding')
      } else {
        throw new Error('Microsoft Login Failed: No access token found')
      }
    } catch (error) {
      console.error('Microsoft Login Failed:', error)
    }
  }

  const serverurl = process.env.REACT_APP_USER_URL || ''

  const saveUserData = async (userData: Record<string, any>) => {
    try {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData = await ipInfoResponse.json()
      const signupLink = localStorage.getItem('sign_up_link') || ''

      const userIPCountryData = {
        ...userData,
        source: '',
        user_ipcountry: ipInfoData.country || '',
        user_country_name: ipInfoData.country_name || '',
        sign_up_link: signupLink,
      }

      await fetch(`${serverurl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userIPCountryData }),
      })
    } catch (error) {
      console.error('Error storing user data:', error)
    }
  }

  return (
    <div className="relative flex flex-col shadow-lg h-screen">
      {/* Background Split */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#3667B2]"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>

      <div className="relative flex flex-col md:flex-row justify-center items-center h-full w-full">
        {/* Image Section */}
        <div className="flex justify-center items-center h-[40vh] md:h-full w-full md:w-1/2 px-4 md:px-0">
          <img
            src={ContentImage}
            alt="Auth"
            className="h-full w-full max-h-[400px] md:max-h-none object-cover rounded-lg"
            loading="lazy"
          />
        </div>
        {/* Details Section */}
        <div className="flex justify-center items-center h-[60vh] md:h-full w-full md:w-1/2 px-6 md:px-12">
          <div className="p-6 bg-transparent border-2 border-[#004264] shadow-lg text-white rounded-lg flex flex-col items-center w-full max-w-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">
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
    </div>
  )
}

export default Login
