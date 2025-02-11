import axios from 'axios'
import React, { useEffect, useState } from 'react'

import {
  FaBox,
  FaDesktop,
  FaChartLine,
  FaBullhorn,
  FaBuilding,
  FaFileAlt,
  FaFileInvoice,
  FaEllipsisH,
  FaTimes,
  FaUpload,
  FaCheck,
  FaInfoCircle,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { IpInfoResponse } from '../../types/authTypes'
import { Plan } from '../../types/pricingTypes'
import { PricingModal } from '../shared/PricingModal'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setUserPlan } from '../../redux/slices/userSlice'
import uploadFileToS3 from '../../utils/uploadFileToS3'
import GuidedTour from '../onboarding/shared/GuidedTour'
import GuidedTourMobile from '../onboarding/shared/GuidedTourMobile'
import { Dialog } from '@headlessui/react'

const SelectPresentationType: React.FC = () => {
  const presentationTypes = [
    { id: 1, label: 'Product', icon: <FaBox className="text-[#3667B2]" /> },
    {
      id: 2,
      label: 'Pitch Deck',
      icon: <FaDesktop className="text-[#3667B2]" />,
    },
    {
      id: 3,
      label: 'Sales Deck',
      icon: <FaChartLine className="text-[#3667B2]" />,
    },
    {
      id: 4,
      label: 'Marketing',
      icon: <FaBullhorn className="text-[#3667B2]" />,
    },
    {
      id: 5,
      label: 'Company Overview',
      icon: <FaBuilding className="text-[#3667B2]" />,
    },
    {
      id: 6,
      label: 'Project Proposal',
      icon: <FaFileInvoice className="text-[#3667B2]" />,
    },
    {
      id: 7,
      label: 'Project Summary',
      icon: <FaFileAlt className="text-[#3667B2]" />,
    },
    {
      id: 8,
      label: 'Others',
      icon: <FaEllipsisH className="text-[#3667B2]" />,
    },
  ]
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  


  const handleColorChange = (key: keyof typeof brandingColors, color: string): void => {
    setBrandingColors((prev) => ({ ...prev, [key]: color }));
  };
  const [file, setFile] = useState<File | null>(null)
  const [pdfLink, setPdfLink] = useState('')
  const [pdfUploading, setPDFUploading] = useState(false)
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [customTypeInput, setCustomTypeInput] = useState<string>('')
  const navigate = useNavigate()
  const authToken = sessionStorage.getItem('authToken')
  const orgId = sessionStorage.getItem('orgId')
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const pricingModalHeading = 'Refine PPT'
  const userPlan = useSelector((state: any) => state.user.userPlan)
  const [monthlyPlan, setMonthlyPlan] = useState<Plan>()
  const [yearlyPlan, setYearlyPlan] = useState<Plan>()
  const [currency, setCurrency] = useState('')
  const [subId, setSubId] = useState('')
  const dispatch = useDispatch()
  const [eligibleForGeneration, setEligibleForGeneration] = useState(false)
  const [pptCount, setPptCount] = useState(0)
  const [pptCountMonthly, setPptCountMonthly] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [showTooltip3, setShowTooltip3] = useState(false);
  const [showTooltip4, setShowTooltip4] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#000000'); // Define the primary color
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF'); // Define the secondary color
  const [generateInput, setGenerateInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState(null);
  const [generatedDocumentIDoutline, setGeneratedDocumentIDoutline] = useState<string | null>(null);
  const [brandingColors, setBrandingColors] = useState<string[]>([]); // Initialize branding colors
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add a loading state



  const generateDocumentID = () => {
    return 'Document-' + Date.now()
  }
  const generatedDocumentID = generateDocumentID()

  const MAX_FILE_SIZE_MB = 20 // Limit file size to 20MB

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPDFUploading(true)

    if (event.target.files && event.target.files[0]) {
      const uploadedFile = event.target.files[0]

      // Check file size
      const fileSizeMB = uploadedFile.size / (1024 * 1024)
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        toast.error(
          `File size exceeds ${MAX_FILE_SIZE_MB}MB. Please upload a smaller file.`,
          {
            position: 'top-right',
            autoClose: 3000,
          }
        )
        setPDFUploading(false)
        return
      }

      setFile(uploadedFile)

      try {
        const pdfUploaded = {
          name: uploadedFile.name,
          type: uploadedFile.type,
          body: uploadedFile, // Pass the File object directly
        }
        // Handle upload
        const pdfLink = await uploadFileToS3(pdfUploaded)
        setPdfLink(pdfLink)
      } catch (error) {
        console.error('Error uploading file:', error)
        toast.error('Failed to upload file. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        })
      } finally {
        setPDFUploading(false)
      }
    } else {
      setPDFUploading(false)
    }
  }

  const handleGenerate = () => {
    navigate(
      `/presentation-view?documentID=${generatedDocumentIDoutline}`
    )

    const quickGenerate = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}/${generatedDocumentIDoutline}`,
          {
            pptInput: generateInput,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        await response.data
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error('Error generating ppt', {
            position: 'top-right',
            autoClose: 3000,
          })
        }
      }
    }

    const updatePptCount = async () => {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
        {
          pptcount: pptCount + 1,
          pptcount_monthly: pptCountMonthly + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
    }

    quickGenerate()
    updatePptCount()
  }
  const handleSaveColors = async () => {
    setIsLoading(true); // Show loading state
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile//organization/updateColors/${orgId}`,
        { primaryColor, secondaryColor },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      if (response.status === 200) {
        const colors = response.data.colors; // Extract color object
  
        // Convert object values into an array
        const colorArray: string[] = [
          colors[0],
          colors[3],
          colors[2],
          colors[4],
          colors[1],
         
         
        ];
  
       await setBrandingColors([...colorArray]); // Ensure React detects state change
      }
    } catch (error) {
      console.error("Error updating branding colors:", error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };
  
  const handleRefinePPT = () => {
    const refinePPT = async () => {
      if (!file) {
        toast.info('Please upload a PDF to refine', {
          position: 'top-right',
          autoClose: 3000,
        })
        return
      }

      navigate(
        `/presentation-view?documentID=${generatedDocumentIDoutline}`
      )

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/refineppt/${orgId}/${generatedDocumentIDoutline}`,
          {
            pdfLink: pdfLink,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )

        await response.data
      } catch (error: any) {
       
        
      }
    }

    const updatePptCount = async () => {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
        {
          pptcount: pptCount + 1,
          pptcount_monthly: pptCountMonthly + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
    }
    refinePPT()
    updatePptCount()
  }

  const isButtonDisabled =
  selectedType === 8
    ? !customTypeInput.trim() || (userPlan !== "pro" && !eligibleForGeneration)
    : !selectedType || (userPlan !== "pro" && !eligibleForGeneration);


  // API CALL TO GET PRICING DATA FOR MODAL AND USER PLAN
  useEffect(() => {
    const getPricingData = async () => {
      const ipInfoResponse = await fetch(
        'https://ipinfo.io/json?token=f0e9cf876d422e'
      )
      const ipInfoData: IpInfoResponse = await ipInfoResponse.json()

      await axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/appscripts/razorpay/plans`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        .then((response) => {
          const country = ipInfoData!.country!
          if (country !== 'IN' && country !== 'India' && country !== 'In') {
            setMonthlyPlan(response.data.items[4])
            setYearlyPlan(response.data.items[2])
            // setMonthlyPlan(response.data.items[1])
            // setYearlyPlan(response.data.items[0])
            setCurrency('USD')
          } else if (
            country === 'IN' ||
            country === 'India' ||
            country === 'In'
          ) {
            setMonthlyPlan(response.data.items[5])
            setYearlyPlan(response.data.items[3])
            // setMonthlyPlan(response.data.items[1])
            // setYearlyPlan(response.data.items[0])
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
        const planName = response.data.plan.plan_name
        const subscriptionId = response.data.plan.subscriptionId
        setPptCount(response.data.pptcount)
        setPptCountMonthly(response.data.pptcount_monthly)
        if (planName === "pro" || response.data.is_eligible === true) {
          setEligibleForGeneration(true)
        } else  {
          setEligibleForGeneration(false)
        }
        dispatch(setUserPlan(planName))
        setSubId(subscriptionId)
      } catch (error) {
        console.error('Error fetching user plan:', error)
      }
    }

    fetchUserPlan()
    getPricingData()
  }, [])
  const monthlyPlanAmount = monthlyPlan?.item.amount! / 100
  const monthlyPlanId = monthlyPlan?.id
  const yearlyPlanAmount = yearlyPlan?.item.amount! / 100
  const yearlyPlanId = yearlyPlan?.id
  const Tooltip: React.FC<{ message: string }> = ({ message }) => {
    return (
      <div className="absolute left-8 bottom-10 w-72 bg-gray-800 text-white text-sm rounded-lg px-4 py-2 shadow-lg">
        {message}
      </div>
    );
  };
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isHovered && visibleTooltip === "generate") {
      timeout = setTimeout(() => {
        setVisibleTooltip(null);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isHovered, visibleTooltip]);

  const generateOutline = async () => {
    setLoading(true);

    let docID = generatedDocumentIDoutline;
    if (!generatedDocumentIDoutline) {
      docID = generateDocumentID();
      setGeneratedDocumentIDoutline(docID);
    }

    const payload = {
      pptInput: generateInput || "",
      pdfLink: pdfLink || "",
    };

    try {
      const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/outline/${orgId}/${docID}`;

      const response = await axios.post(requestUrl, payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status !== 200) throw new Error("Failed to generate outline");

      setOutline(response.data.outline);

      // Notify the parent component that the outline was successfully generated
      onOutlineSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response?.data || error.message);
      } else {
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const generateDocument = async () => {
    setLoading(true);
    navigate(
      `/presentation-view?documentID=${generatedDocumentIDoutline}`
    )
    if (!generatedDocumentIDoutline) {
      console.error("Error: Document ID is missing. Generate outline first.");
      setLoading(false);
      return;
    }
  
    const payload = {
      websiteUrl: websiteUrl || "",
    };
  
    try {
      const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/documentgenerate/generate-document/${orgId}/${generatedDocumentIDoutline}`;
  
      console.log("Document Request URL:", requestUrl);
      console.log("Payload:", payload);
  
      const response = await axios.post(requestUrl, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      if (response.status !== 200) throw new Error("Failed to generate document");
  
      const data = response.data;
      setOutline(data.outline);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };
  
  const handleButtonClick = async () => {
    try {
      const documentID = await generateDocument(); // Wait for completion
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };
  return (
    <div className="flex p-4 flex-col items-center justify-center h-screen w-screen  bg-gradient-to-br from-[#f1f1f3] via-[#aec2e6] to-[#fafafa]"> 
<div className="relative  w-full    text-center flex flex-col items-center mt-[-20vh]">
  <div className="absolute inset-0z-[-1] rounded-2xl"></div>
  <h2 className="text-2xl font-semibold text-gray-700 mb-8">
    Tell us what you want to build
  </h2>
        <p className="text-gray-500  flex items-center gap-1 relative text-lg">
          Enter your presentation context.
          <span
            className="text-blue-500 cursor-pointer relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <FaInfoCircle className="text-[#3667B2] cursor-pointer relative" />
            {showTooltip && (
  <div className="absolute hidden lg:block left-full ml-2  transform -translate-y-1/2 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-100 transition-opacity duration-300 text-left">
        <p className="font-semibold">Provide clear details about your presentation requirements. The more specific you are, the more relevant the output will be.</p>
       <p> - Outline the objective and key message of the presentation.</p>
        <p>- Specify any required slides, information, or data to include.</p>
           <p>- Provide detailed instructions to ensure alignment with your vision.</p>
      </div>
      
    )}
  {showTooltip && (
  <div className="absolute top-0 lg:hidden left-[80%] -translate-x-[80%] -translate-y-[80%] w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-100 transition-opacity duration-300 text-left">
    <p className="font-semibold">
      Provide clear details about your presentation requirements. The more specific you are, the more relevant the output will be.
    </p>
    <p>- Outline the objective and key message of the presentation.</p>
    <p>- Specify any required slides, information, or data to include.</p>
    <p>- Provide detailed instructions to ensure alignment with your vision.</p>
  </div>
)}

          </span>
        </p>
        <div className="mt-2 w-full">
          <textarea
            className="lg:w-1/2 h-[7rem]  w-full text-[#091220] py-2 px-4 rounded-xl scrollbar-none resize-none"
            placeholder="Add text or drop content here — more details mean a more tailored presentation!"
            value={generateInput || ''}
            onChange={(e) => setGenerateInput(e.target.value)}
            maxLength={10000}
          ></textarea>
        </div>
        <div className="border-t border-gray-300 my-8 relative w-full items-center justify-center">
          <span className="absolute top-[-15px] left-1/2 transform -translate-x-1/2  px-2 font-bold text-lg">
            or
          </span>
        </div>
        <p className="text-gray-500  mb-2 mt-2 flex items-center gap-1 relative text-lg">
  Refine an existing document.
  <span
    className="text-blue-500 cursor-pointer relative"
    onMouseEnter={() => setShowTooltip1(true)}
    onMouseLeave={() => setShowTooltip1(false)}
  >
    <FaInfoCircle className="text-[#3667B2] cursor-pointer relative" />

    {showTooltip1 && (
      <div className="absolute hidden lg:block text-left bottom-8 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-100  transition-opacity duration-300">
        <p className="font-semibold">Refine an existing document:</p>
        <p>Upload a document to refine and transform it into a visually stunning presentation</p>
      </div>
    )}
    {showTooltip1 && (
      <div className="absolute lg:hidden text-left bottom-8 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-100  transition-opacity duration-300">
        <p className="font-semibold">Refine an existing document:</p>
        <p>Upload a document to refine and transform it into a visually stunning presentation</p>
      </div>
    )}
  </span>
</p>



        <div className=" w-[80%] lg:w-1/4 justify-center">
          {pdfUploading && (
            <div className="flex items-center justify-center h-[3.1rem] mt-2 bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl">
              <span>Uploading...</span>
            </div>
          )}
          {file && !pdfUploading && (
            <div className="flex items-center justify-center h-[3.1rem] bg-white border border-[#5D5F61] text-[#091220] py-2 px-4 rounded-xl">
              <span className="text-[#5D5F61] truncate">{file.name}</span>
              <button
                className="text-[#8A8B8C] ml-2"
                onClick={() => {
                  setFile(null);
                  setPdfLink('');
                }}
              >
                <FaTimes />
              </button>
            </div>
          )}
          {!file && (
            <label className="flex items-center justify-center h-[3.1rem]  bg-white border text-[#091220] py-2 px-4 rounded-xl cursor-pointer">
              <FaUpload className="mr-2 text-[#5D5F61]" />
              <span>Upload a Document</span>
              <input
                type="file"
                accept=".pdf, .doc, .docx, .ppt, .pptx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
        <div className=" flex justify-center mt-8 relative"
        onMouseEnter={() => {
     
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setTimeout(() => setIsHovered(false), 3000); // Hide after 3 seconds
        }}>
          <button
            id="generate-presentation"
            onClick={() => {
              setIsRefineModalOpen(true);
              generateOutline(); // Call the function
            }}

            disabled={!file && !generateInput || pdfUploading || !eligibleForGeneration}
            className={`h-[3.1rem] text-white px-16 py-4 rounded-lg font-semibold active:scale-95 transition transform duration-300 flex items-center justify-center ${
              !file && !generateInput || pdfUploading || !eligibleForGeneration
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#3667B2] hover:bg-[#0A8568]'
            }`}
          >
            Submit
          </button>
          {!eligibleForGeneration && isHovered&&(
            <div className="absolute top-full  mt-2 w-[14rem] bg-gray-200 text-black p-2 rounded-2xl shadow-lg flex items-center justify-center opacity-100 transition-opacity duration-300">
              <p className="text-sm text-center text-gray-800">
                Please {" "}
                <span
                  onClick={() => setIsPricingModalOpen(true)}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  upgrade
                </span>{" "}
                to generate more presentations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Modal */}
      {isPricingModalOpen && userPlan === 'free' ? (
        <PricingModal
          closeModal={() => {
            setIsPricingModalOpen(false)
          }}
          heading={pricingModalHeading}
          subscriptionId={subId}
          monthlyPlanAmount={monthlyPlanAmount}
          yearlyPlanAmount={yearlyPlanAmount}
          currency={currency}
          monthlyPlanId={monthlyPlanId!}
          yearlyPlanId={yearlyPlanId!}
          authToken={authToken!}
          orgId={orgId!}
        />
      ) : (
        <></>
      )}

      {/* Refine Modal */}
      {isRefineModalOpen && (
       <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30">
     {/* Modal Container */}
<div className="bg-white lg:p-6 p-3 rounded-2xl shadow-lg w-[90%] h-[27rem] max-w-3xl flex flex-col justify-between relative translate-y-5">
  
  {/* Close Button */}
  <button
    onClick={() => setIsRefineModalOpen(false)}
    className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
  >
    <FaTimes className="text-gray-600" />
  </button>

  {/* Title */}
  <h2 className="text-xl font-bold text-[#091220] text-center">
    Presentation Options
  </h2>

  {/* Content Wrapper - Space Out Sections Evenly */}
  <div className="flex flex-col space-y-10">
    
    {/* Reference Web URL */}
    <div className="relative space-y-2">
      <label className="font-semibold text-gray-700 flex items-center gap-2">
        Reference Web URL (optional)
        <span
          className="text-[#3667B2] cursor-pointer relative"
          onMouseEnter={() => setShowTooltip3(true)}
          onMouseLeave={() => setShowTooltip3(false)}
        >
          <FaInfoCircle className="text-base" />
          {showTooltip3 && (
            <div className="absolute text-left left-1/2 bottom-8 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-100 transform -translate-x-1/2 transition-opacity duration-300">
              <p className="font-semibold">Why add a reference URL?</p>
              <p>Provide a web URL from which you would like us to include information for the presentation.</p>
            </div>
          )}
        </span>
      </label>
      <input
        type="text"
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg text-start shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
        placeholder="Enter website URL"
      />
    </div>

    {/* Branding Colors */}
    <div>
      <div className="flex items-center relative">
        <label className="font-semibold text-gray-700">Branding Colors</label>
        <div
          className="relative flex items-center ml-2"
          onMouseEnter={() => setShowTooltip4(true)}
          onMouseLeave={() => setShowTooltip4(false)}
        >
          <FaInfoCircle className="text-[#3667B2] cursor-pointer" />
          {showTooltip4 && (
            <div className="absolute text-left left-1/2 bottom-8 w-72 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg transform -translate-x-1/2 transition-opacity duration-300 opacity-100">
              <p className="font-semibold">Branding Colors</p>
              <p>These are the colors that will be used in your presentation. If you've uploaded a logo, the colors have been extracted from it.</p>
            </div>
          )}
        </div>
      </div>

   {/* Branding Colors Display */}
<div className="flex justify-between items-center gap-2 lg:gap-0 mt-4 w-full">
  
  {/* Rectangular Color Strip */}
  <div className="flex w-2/3 h-10 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
    {isLoading ? (
      <p className="text-gray-500 flex items-center justify-center w-full">Loading colors...</p>
    ) : (
      brandingColors?.map((color, index) => (
        <div
          key={index}
          className="h-full flex-1 transition-transform transform hover:scale-105"
          style={{ backgroundColor: color }}
        />
      ))
    )}
  </div>

  {/* Change Colors Button */}
  <button
    className={`bg-white lg:h-[2.5rem] border-[#3667B2] border text-[#3667B2] 
    hover:bg-[#3667B2] hover:text-white text-base font-medium px-4 py-2 
    rounded-md active:scale-95 transition transform duration-300 ${
      isLoading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    onClick={() => !isLoading && setIsModalOpen(true)}
    disabled={isLoading}
  >
    Change branding colors
  </button>
</div>


    </div>
  </div>

  {/* Generate Presentation Button */}
  <div className="flex w-full justify-center">
  <button 
    className="lg:w-1/2 w-[80%] bg-[#3667B2]  hover:bg-[#0A8568] text-white py-2 rounded-lg font-semibold active:scale-95 transition transform duration-300 mt-4"
    onClick={handleButtonClick}
  >
    Generate Presentation
  </button>
</div>

     </div>
     </div>
      )}
       {/* Color Selection Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md relative">
      <h2 className="text-xl font-bold text-[#091220] mb-4 text-center">
        Select Branding Colors
      </h2>

      <div className="space-y-4">
        {/* Primary Color */}
        <div className="grid grid-cols-3 items-center gap-2">
          <label className="font-semibold text-gray-700">Primary Color:</label>
          <input
            type="text"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-24 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
          />
          <div className="relative w-12 h-12">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        </div>

        {/* Secondary Color */}
        <div className="grid grid-cols-3 items-center gap-2">
          <label className="font-semibold text-gray-700">Secondary Color:</label>
          <input
            type="text"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="w-24 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
          />
          <div className="relative w-12 h-12">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-12 h-12 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>
      </div>

      {/* Modal Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          onClick={() => setIsModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-[#3667B2] text-white rounded-lg hover:bg-[#274b8a] transition-all shadow-md"
          onClick={() => { handleSaveColors(); setIsModalOpen(false); }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
      <GuidedTour />
      <GuidedTourMobile />
    </div>
  )
}

export default SelectPresentationType
const onOutlineSuccess = (success: boolean) => {
  if (success) {
    toast.success('Outline generated successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
  } else {
    toast.error('Failed to generate outline. Please try again.', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
};

