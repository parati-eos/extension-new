// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const navigate = useNavigate();
//   const [presentationId, setPresentationId] = useState<string | null>(null);

//   useEffect(() => {
//     // Extract presentationId from the URL if running inside Google Slides
//     const queryParams = new URLSearchParams(window.location.search);
//     const presId = queryParams.get("presentationId");

//     if (presId) {
//       setPresentationId(presId);
//       localStorage.setItem("presentationId", presId); // Store in localStorage
//     } else {
//       const storedId = localStorage.getItem("presentationId");
//       if (storedId) {
//         setPresentationId(storedId); // Retrieve stored ID if available
//       }
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-3xl font-bold mb-6">Welcome to Google Slides Extension</h1>
      
//       {presentationId ? (
//         <p className="text-lg mb-4 font-semibold text-green-700">
//           ✅ Presentation ID: {presentationId}
//         </p>
//       ) : (
//         <p className="text-lg mb-4 text-red-500 font-medium">
//           ❌ No Presentation ID Found
//         </p>
//       )}

//       <button
//         className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         onClick={() => navigate("/login")}
//       >
//         Create Presentation
//       </button>
//     </div>
//   );
// };

// export default Home;
import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8989/api/v1/ads";

const GoogleAdsIntegration = () => {
  const [authUrl, setAuthUrl] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  /** Step 1: Get Google Ads OAuth URL */
  const getAuthURL = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth-url`);
      setAuthUrl(response.data.authURL);
    } catch (error) {
      console.error("Error fetching auth URL:", error);
    }
  };

  /** Step 2: Handle OAuth Callback (Manually get refreshToken from backend response) */
  const handleCallback = async (code: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/callback?code=${code}`);
      setRefreshToken(response.data.tokens.refresh_token);
    } catch (error) {
      console.error("Error handling callback:", error);
    }
  };

  /** Step 3: Fetch Google Ads Accounts */
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/accounts`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  /** Step 4: Fetch Campaigns for Selected Account */
  const fetchCampaigns = async (customerId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaigns/${customerId}`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  /** Step 5: Fetch Google Ads Report */
  const fetchReport = async (customerId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/report/${customerId}?dateRange=LAST_30_DAYS`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      setReports(response.data.report);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Google Ads Integration</h2>

      {/* Step 1: Generate Auth URL */}
      <button onClick={getAuthURL} className="bg-blue-500 text-white px-4 py-2 rounded">
        Get Google Ads Auth URL
      </button>

      {authUrl && (
        <div className="mt-4">
          <a href={authUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            Click here to authenticate Google Ads
          </a>
        </div>
      )}

      {/* Step 2: Enter Auth Code Manually */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter Auth Code"
          className="border p-2"
          onBlur={(e) => handleCallback(e.target.value)}
        />
      </div>

      {/* Step 3: Fetch Accounts */}
      <button onClick={fetchAccounts} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Fetch Google Ads Accounts
      </button>

      {/* Step 4: Select Account */}
      {accounts.length > 0 && (
        <select
          className="border p-2 mt-4"
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts.map((account) => (
            <option key={account} value={account}>
              {account}
            </option>
          ))}
        </select>
      )}

      {/* Step 5: Fetch Campaigns */}
      {selectedAccount && (
        <button
          onClick={() => fetchCampaigns(selectedAccount)}
          className="bg-purple-500 text-white px-4 py-2 rounded mt-4"
        >
          Fetch Campaigns
        </button>
      )}

      {/* Step 6: Fetch Reports */}
      {selectedAccount && (
        <button
          onClick={() => fetchReport(selectedAccount)}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Fetch Reports
        </button>
      )}

      {/* Display Data */}
      <div className="mt-6">
        {campaigns.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Campaigns:</h3>
            <pre>{JSON.stringify(campaigns, null, 2)}</pre>
          </div>
        )}

        {reports.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Reports:</h3>
            <pre>{JSON.stringify(reports, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAdsIntegration;
