import React, { useEffect, useState } from 'react';
import { DisplayMode } from '../../@types/presentationView';
import { BackButton } from './BackButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCredit } from '../../hooks/usecredit';
import { FaCoins } from 'react-icons/fa';

interface ClickProps {
  onTypeClick: (typeName: DisplayMode) => void;
  setDisplayMode: React.Dispatch<React.SetStateAction<DisplayMode>>;
}

const CustomBuilderMenu: React.FC<ClickProps> = ({
  onTypeClick,
  setDisplayMode,
}) => {
  const [planName, setPlanName] = useState('free');
  const navigate = useNavigate();

  const orgID = sessionStorage.getItem('orgId') || '';
  const authToken = sessionStorage.getItem('authToken') || '';
  const { credits, updateCredit, increaseCredit, decreaseCredit } = useCredit();

  const handleUpgradeCredit = (val: number) => {
    updateCredit(val);
  };

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
      setPlanName(res.data?.plan?.plan_name || 'free');
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      handleUpgradeCredit(0);
      setPlanName('free');
    }
  };

  const refreshCredits = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      await fetchCredits();
      toast.success('Credits refreshed');
    } catch (err) {
      console.error('Failed to refresh credits:', err);
      toast.error('Credit refresh failed');
    }
  };

  useEffect(() => {
    if (orgID && authToken) {
      fetchCredits();
    }
  }, [orgID, authToken]);

  const handleUpgrade = () => {
    const query = new URLSearchParams({
      authToken: authToken || '',
      userEmail: sessionStorage.getItem('userEmail') || '',
      orgId: orgID,
    });
    window.open(`/pricing?${query.toString()}`, '_blank', 'noopener,noreferrer');
  };

  const slideTypes: { name: DisplayMode; icon: string }[] = [
    { name: 'Points', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435466780_points.svg' },
    { name: 'Timeline', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435399743_Presentation.svg' },
    { name: 'Images', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg' },
    { name: 'Table', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435575006_table.svg' },
    { name: 'People', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435517252_images.svg' },
    { name: 'Statistics', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435650523_statistics.svg' },
    { name: 'Graphs', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1739435703873_graphs.svg' },
    { name: 'TextandImage', icon: 'https://d2zu6flr7wd65l.cloudfront.net/uploads/1742886487822_Presentation.svg' },
  ];

  const lockedTypes = ['Images', 'Table', 'People', 'Graphs'];

  const onBack = () => {
    setDisplayMode('slides');
  };

  const handleClick = (type: DisplayMode) => {
    const isLocked = lockedTypes.includes(type);
    const hasCredits = credits >= 5;
    const isFreePlan = planName === 'free';

    if (isLocked && isFreePlan && !hasCredits) {
      toast.error('Not enough credits (5 required).');
      return;
    }

    onTypeClick(type);

    // if (isLocked && isFreePlan) {
    //   decreaseCredit(5);
    // }
  };

  const unlocked = slideTypes.filter((type) => !lockedTypes.includes(type.name));
  const locked = slideTypes.filter((type) => lockedTypes.includes(type.name));

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
      {planName === 'free' && (
        <div className="flex justify-end items-center text-sm mt-2 px-1 gap-10">
          <div className="text-gray-800 font-medium">
            <button
                onClick={refreshCredits}
                className="text-md text-blue-500 underline self-start"
              >
                ↻ Refresh Credits
              </button>
          </div>
          <div className="text-gray-800 font-medium">
              <span className="flex items-center gap-1">
                <FaCoins className="text-yellow-400" /> Credits Available: {credits}
              </span>
          </div>
          <div className="text-red-600">
            <button
              className="text-blue-600 font-medium flex items-center gap-1"
              onClick={handleUpgrade}
            >
              Get More Credits <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Unlocked Slides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {unlocked.map((type) => (
          <div
            key={type.name}
            className="relative flex flex-col items-center border border-[#E1E3E5] rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow"
            onClick={() => handleClick(type.name)}
          >
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
            >
              {planName === 'free' && (
                <div className="absolute  flex gap-2 top-1 right-1 text-[10px] bg-black text-white px-2 py-0.5 rounded-full shadow font-semibold  tracking-wide z-10">
                  <FaCoins className="text-yellow-400 text-sm" /> 5 Credits
                </div>
              )}

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
