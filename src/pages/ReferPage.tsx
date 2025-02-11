import React, { useEffect, useState } from 'react';
import ReferralPage from '../components/landing-page/Refer';
import Navbar from '../components/shared/Navbar';
import axios from 'axios';

const ReferPage: React.FC = () => {
  const [userPlan, setUserPlan] = useState("free"); // Default plan
  const [referredByOrgId, setReferredByOrgId] = useState<string | null>(null);
  const [referredByUserId, setReferredByUserId] = useState<string | null>(null);

  const authToken = sessionStorage.getItem("authToken");
  const orgId = sessionStorage.getItem("orgId");

 

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!orgId || !authToken) return; // Prevent API call if values are missing

      try {
        const response = await axios.get(
          `http://34.239.191.112:5001/api/v1/data/organizationprofile/organization/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setUserPlan(response.data.plan.plan_name); // Update state
      } catch (error) {
        console.error("Error fetching user plan:", error);
      }
    };

    fetchUserPlan();
  }, [orgId, authToken]);

  return (
    <div className="h-dvh bg-gray-100 no-scrollbar">
      <Navbar />
      <div className="bg-gray-50">
        <ReferralPage 
          userPlan={userPlan} 
          referredByOrgId={referredByOrgId} 
          referredByUserId={referredByUserId} 
        />
      </div>
    </div>
  );
};

export default ReferPage;