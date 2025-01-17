import { FaClock, FaPlus, FaUser } from 'react-icons/fa'
import ZynthLogoText from '../../assets/zynth-text.png'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { PricingModal } from './PricingModal'
import { Plan } from '../../types/pricingTypes'
import axios from 'axios'
import { IpInfoResponse } from '../../types/authTypes'
import GuidedTour from '../onboarding/shared/GuidedTour'
import GuidedTourMobile from '../onboarding/shared/GuidedTourMobile'
interface NavbarProps {
  showHistoryId?: boolean // Add a prop to control the "history" ID
  showOrganizationProfileId?: boolean // Add a prop to control the "organization-profile" ID
}

const Navbar: React.FC<NavbarProps> = ({
  showHistoryId,
  showOrganizationProfileId,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const userProfileImage = sessionStorage.getItem('userDP')
  const [currency, setCurrency] = useState<string>()
  const userProfileRef = useRef<HTMLDivElement | null>(null) // Reference to the profile image to handle click toggles
  const [subId, setSubId] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ensure dropdownRef is not null and contains the clicked target
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        userProfileRef.current &&
        !userProfileRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false) // Close dropdown if clicked outside
      }
    }

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup the event listener when the component is unmounted or when dropdown state changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, []) // Empty dependency array ensures this effect runs once

  // API CALL TO GET PRICING DATA FOR MODAL
  useEffect(() => {
    const getPricingData = async () => {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/payments/razorpay/plans`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          const country = ipInfoData!.country!

          if (country !== 'IN' && country !== 'India' && country !== 'In') {
            // setMonthlyPlan(response.data.items[4])
            // setYearlyPlan(response.data.items[2])
            setMonthlyPlan(response.data.items[1])
            setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          } else if (
            country === 'IN' ||
            country === 'India' ||
            country === 'In'
          ) {
            // setMonthlyPlan(response.data.items[5])
            // setYearlyPlan(response.data.items[3])
            setMonthlyPlan(response.data.items[1])
            setYearlyPlan(response.data.items[0])
            setCurrency('INR')
          }
        })
    }

    const fetchUserPlan = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        const subscriptionId = response.data.plan.subscriptionId
        setSubId(subscriptionId)
      } catch (error) {
        console.error('Error fetching user plan:', error)
      }
    }

    fetchUserPlan()

    const timer = setTimeout(() => {
      getPricingData()
    }, 3000) // delay

    // Cleanup the timer in case the component unmounts
    return () => clearTimeout(timer)
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const monthlyPlanId = monthlyPlan?.id
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100
  const yearlyPlanId = yearlyPlan?.id

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState) // Toggle dropdown state
  }

  return (
    <nav className="bg-white p-2 lg:p-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a
          className="transition-all duration-300 transform hover:scale-110 active:scale-95 active:opacity-80"
          href="/"
          target="_blank"
        >
          <img src={ZynthLogoText} alt="Logo Text" className="h-8" />
        </a>

        {/* Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/new-presentation')}
            className="bg-[#3667B2] border border-[#3667B2] lg:h-[2.5rem] text-white hover:bg-white hover:text-[#3667B2] hover:border-[#3667B2] hover:border text-base font-medium px-4 py-4 lg:py-2 rounded-md active:scale-95 transition transform duration-300"
          >
            <span className="sm:hidden text-base">
              <FaPlus />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaPlus />
              <span>New Presentation</span>
            </span>
          </button>
          <button
            id={showHistoryId ? 'history' : undefined} // Conditionally apply the ID
            onClick={() => navigate('/history')}
            className="bg-white lg:h-[2.5rem] border-[#3667B2] border text-[#3667B2] hover:bg-[#3667B2] hover:text-white hover:border-[#3667B2] hover:border text-base font-medium px-4 py-4 lg:py-2 rounded-md active:scale-95 transition transform duration-300"
          >
            <span className="sm:hidden text-base">
              <FaClock />
            </span>
            <span className="hidden sm:flex items-center space-x-2">
              <FaClock />
              <span>History</span>
            </span>
          </button>
          {/* User Profile Icon */}
          <div
            id={showOrganizationProfileId ? 'organization-profile' : undefined} // Conditionally apply the ID
            ref={userProfileRef}
          >
            {userProfileImage ? (
              <img
                src={userProfileImage}
                alt="User Profile"
                className="w-11 h-11 lg:w-11 lg:h-11 rounded-full hover:scale-105 cursor-pointer"
                onClick={toggleDropdown} // Toggle dropdown when clicked
              />
            ) : (
              <FaUser
                className="w-11 h-11 lg:w-10 lg:h-10 rounded-full hover:scale-105 cursor-pointer"
                onClick={toggleDropdown} // Toggle dropdown when clicked
              />
            )}
          </div>
          {/* Dropdown */}
          {dropdownOpen && (
            <div
              ref={dropdownRef} // Attach the reference to the dropdown container
              className="fixed top-20 lg:top-17 right-2 lg:right-4 bg-white shadow-lg rounded-md p-2 z-50 w-48 h-32"
            >
              <button
                onClick={() => navigate('/organization-profile')}
                className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Organization Profile
              </button>
              <button
                onClick={() => setIsPricingModalOpen(true)}
                className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Subscription Plans
              </button>

              <button
                className="w-full text-[#5D5F61] text-left text-sm py-1 px-4 hover:bg-gray-100 overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <PricingModal
          closeModal={() => setIsPricingModalOpen(false)}
          heading="Subscription Plans"
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          subscriptionId={subId}
          currency={currency!}
          yearlyPlanId={yearlyPlanId!}
          monthlyPlanId={monthlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
        />
      )}
      <GuidedTour />
      <GuidedTourMobile />
    </nav>
  )
}

export default Navbar
