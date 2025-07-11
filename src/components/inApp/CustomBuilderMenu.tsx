import React, { useEffect, useState } from 'react';
import { DisplayMode } from '../../@types/presentationView';
import { BackButton } from './BackButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import { useCredit } from '../../hooks/usecredit';

interface ClickProps {
  onTypeClick: (typeName: DisplayMode) => void;
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>;
}

const CustomBuilderMenu: React.FC<ClickProps> = ({
  onTypeClick,
  setDisplayMode,
}) => {
  // const [credits, setCredits] = useState(0);
  const [planName, setPlanName] = useState("free");
  const navigate = useNavigate();

  const orgID = sessionStorage.getItem("orgId") || "";
  const authToken = sessionStorage.getItem("authToken") || "";
  const { credits, updateCredit, increaseCredit,decreaseCredit} = useCredit()
  
    const handleAddCredit = () => {
      increaseCredit(5)
    }
  
    const handleDecreaseCredit = () => {
      decreaseCredit(5)
    }  
    const handleUpgradeCredit=(val:number)=>{
      updateCredit(val)
    }

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgID}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        handleUpgradeCredit(res.data?.credits || 0);
        setPlanName(res.data?.plan?.plan_name || "free");
      } catch (err) {
        console.error("Failed to fetch credits:", err);
        handleUpgradeCredit(0);
        setPlanName("free");
      }
    };

    if (orgID && authToken) {
      fetchCredits();
    }
  }, [orgID, authToken]);

  const handleUpgrade = () => {
    const query = new URLSearchParams({
      authToken: authToken || "",
      userEmail: sessionStorage.getItem("userEmail") || "",
      orgId: orgID,
    });
    window.open(`/pricing?${query.toString()}`, "_blank", "noopener,noreferrer");
  };

  const slideTypes: { name: DisplayMode; icon: string }[] = [
    { name: 'Points', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg" },
    { name: 'Timeline', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg" },
    { name: 'Images', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg" },
    { name: 'Table', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435575006_table.svg" },
    { name: 'People', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg" },
    { name: 'Statistics', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435650523_statistics.svg" },
    { name: 'Graphs', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435703873_graphs.svg" },
    { name: 'TextandImage', icon: "https://d2zu6flr7wd65l.cloudfront.net/uploads/1742886487822_Presentation.svg" }
  ];

  const lockedTypes = ['Images', 'Table', 'People', 'Graphs'];

  const onBack = () => {
    setDisplayMode('slides');
  };

  const handleClick = (type: DisplayMode) => {
    const isLocked = lockedTypes.includes(type);
    const hasCredits = credits >= 5;
    const isFreePlan = planName === 'free';

    // if (isLocked && isFreePlan && !hasCredits) {
    //   toast.error("Not enough credits (5 required).");
    //   return;
    // }

    onTypeClick(type);

    // Deduct 5 credits only if on free plan and it's a locked slide
    // if (isLocked && isFreePlan) {
    //   decreaseCredit(5);
    // }
  };

  const unlocked = slideTypes.filter(type => !lockedTypes.includes(type.name));
  const locked = slideTypes.filter(type => lockedTypes.includes(type.name));

  return (
    <div className="flex flex-col h-full lg:p-4 p-2 w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <div>
          <h3 className="font-semibold text-base">Custom Builder</h3>
          <h2 className="hidden lg:block md:text-lg font-semibold text-[#091220]">
            Select the slide type you want to create.
          </h2>
        </div>
        <BackButton onClick={onBack} />
      </div>

      {/* Credits and Notice */}
      { planName === 'free'&&
       <div className="flex justify-end items-center text-sm mt-2 px-1 gap-10">
        <div className="text-gray-800 font-medium">
          <button title='refresh' className='flex min-w-[100px] items-center justify-center rounded-lg bg-gray-200 hover:bg-blue-600 hover:text-white text-md '>
             Refresh
          </button>
         
        </div>
        <div className="text-gray-800 font-medium">
          Credits Available: <span className="text-blue-600">{credits} 🪙</span>
        </div>
        <div className="text-red-600">
          {/* Some slide types require <strong>5 credits</strong>. */}
          <div>
            <button
              className="text-blue-600 font-medium flex items-center gap-1"
              onClick={handleUpgrade}
            >
              Get More Credits <span>→</span>
            </button>
          </div>
        </div>
        
       </div>
      }

      {/* Unlocked Slides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {unlocked.map((type) => (
          <div
            key={type.name}
            className="relative flex flex-col items-center border border-[#E1E3E5] rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
            onClick={() => handleClick(type.name)}
          >
            {/* <div className="absolute top-1 left-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Free
            </div> */}
            <div className="flex flex-col items-center py-4">
              <img src={type.icon} alt={type.name} className="object-none mt-5 mb-2" />
              <span className="text-xs font-medium sm:text-base">{type.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Locked Slides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {locked.map((type) => {
          const isDisabled = planName === 'free' && credits < 5;

          return (
            <div
              key={type.name}
                          className={`relative flex flex-col items-center border border-[#E1E3E5] rounded-lg shadow-md transition-shadow ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
              }`}
              onClick={() => !isDisabled && handleClick(type.name)}

              //className={`relative flex flex-col items-center border border-[#E1E3E5] rounded-lg shadow-md transition-shadow hover:shadow-lg cursor-pointer`}
             // onClick={() =>  handleClick(type.name)}
            >
              {/* Lock Icon */}
              {/* <div className="absolute top-1 right-1 bg-white p-1 rounded-full shadow">
                <FaLock className="text-gray-500 text-xs" />
              </div> */}

              {/* 5 Credits Tag */}
              {/* <div className="absolute top-1 left-1 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
               
              </div> */}

              {/* Premium Badge */}
              {planName=="free"&& <div className="absolute top-1 right-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shadow font-semibold uppercase tracking-wide z-10">
                5 Credits 🪙
              </div>}
             

              <div className="flex flex-col items-center py-4">
                <img src={type.icon} alt={type.name} className="object-none mt-5 mb-2" />
                <span className="text-xs font-medium sm:text-base">{type.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomBuilderMenu;
