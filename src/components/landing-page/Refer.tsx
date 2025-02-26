import { useEffect, useState } from "react";
import refer from "../../assets/refer.png";
import addfriend from "../../assets/add_friend.png";
import image2 from "../../assets/image_right_shadow.png";
import image1 from "../../assets/image_left_shadow.png";
import button1 from "../../assets/octicon_cross-reference-16.png";
import button2 from "../../assets/carbon_copy-link.png";
import axios from "axios";
import { toast } from "react-toastify";
interface ReferralPageProps {
  userPlan: string; // Accept userPlan as a prop
  referredByOrgId: string | null;
  referredByUserId: string | null;
}



export default function ReferralPage({ userPlan }: ReferralPageProps) {
  const [currency, setCurrency] = useState("INR");
  const [freeCredit, setFreeCredit] = useState(250);
  const [proCredit, setProCredit] = useState(500);
  const [referralEmail, setReferralEmail] = useState("");

  const authToken = sessionStorage.getItem("authToken");
  const orgId = sessionStorage.getItem("orgId");
  const userId = sessionStorage.getItem("userEmail"); 
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [referralCredits, setReferralCredits] = useState(0)
 
 

  const handleEmailClick = async () => {
    if (!orgId || !userId) {
      alert("Missing organization ID or user ID.");
      return;
    }
  
    try {
      // Step 1: Generate Referral Link
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/referral/generate-referral`,
        { orgId, userId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      const link = response.data.referralLink;
      setReferralLink(link); // Store the referral link in state
  
      // Step 2: Get user details from session storage
      const userEmail = sessionStorage.getItem("userEmail");
      const referrerName = sessionStorage.getItem("referrerName");
  
      if (!userEmail || !referrerName) {
        console.error("User email or referrer name is missing in session storage.");
        return;
      }
  
      // Step 3: Format multiple email recipients
      const emailList = referralEmail.split(",").map(email => email.trim()).filter(email => email);
  
      if (emailList.length === 0) {
        toast.error("Please enter a valid email.");
        return;
      }
  
      // Step 4: Send Referral Emails
      await axios.post(
        `https://d3rodhz1nayiby.cloudfront.net/api/emails/queue-referral-email`,
        {
          emails: emailList.map(email => ({
            userName: userEmail,
            recipient: email,
            signupLink: link,
            referrerName: referrerName,
          })),
        }
      );

      toast.success("Referral email(s) sent successfully!");
      setReferralEmail(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error handling referral process:", error);
      toast.error("Failed to send referral emails.");
    }
  };
  
  const fetchReferralData = async () => {
    if (!orgId || !authToken) {
      console.error("Missing orgId or authToken");
      return;
    }
  
    try {
      console.log("Auth Token:", authToken);
  
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
        { orgId, userId },
        {
          headers: { Authorization: `Bearer ${authToken}` }, // ✅ Correct header placement
        }
      );
  
      const { successfulReferrals = 0, credits = 0 } = response.data;
      setSuccessfulReferrals(successfulReferrals);
      setReferralCredits(credits);
    } catch (error) {
      console.error(
        "Error fetching referral data:",
        axios.isAxiosError(error) ? error.response?.data || error.message : error
      );
    }
  };
  
  // Call function on page load
  useEffect(() => {
    fetchReferralData();
  }, []);
 console.log("userPlan", userPlan);
  useEffect(() => {
    async function fetchIpInfo() {
      try {
        const response = await fetch("https://zynth.ai/api/users/ip-info");
        const data = await response.json();
        const country = data?.country || "IN";

        if (country === "US") {
          setCurrency("USD");
          setFreeCredit(4.5);
          setProCredit(9.5);
        } else if (country === "EU") {
          setCurrency("EUR");
          setFreeCredit(4.2);
          setProCredit(9.0);
        } else {
          setCurrency("INR");
          setFreeCredit(250);
          setProCredit(500);
        }
      } catch (error) {
        console.error("Error fetching IP info:", error);
      }
    }

    fetchIpInfo();
  }, []);
  const copyToClipboardFallback = (text: string) => {
    const textField = document.createElement("input"); // Use input instead of textarea
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();
    textField.setSelectionRange(0, textField.value.length); // Ensure selection works properly
    document.execCommand("copy");
    document.body.removeChild(textField);
  };
  
  
  const handleReferralClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevents unintended form submission or reload
  
    if (!orgId || !userId) {
      toast.error("Missing organization ID or user ID.");
      return;
    }
  
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/referral/generate-referral`,
        { orgId, userId },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
  
      const link = response.data.referralLink;
  
      if (link) {
        setReferralLink(link); // Update state first
  
        // Clipboard API (modern browsers)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(link);
        } else {
          copyToClipboardFallback(link); // Fallback for mobile
        }
  
        setCopySuccess(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error generating referral link:", error);
      toast.error("Failed to generate referral link.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <h1 className="text-2xl font-bold text-center flex items-center gap-2">
        🎉 INVITE & EARN WITH ZYNTH!
      </h1>

      <p className="text-black font-light text-sm text-center mt-4">
 Love using Zynth? Share it with your friends and unlock exclusive rewards! 🚀 
      </p>
      <p className="text-black font-light text-sm text-center mt-2">
      ✅ Share Your Unique Link – Invite friends to try Zynth.
      </p>
      <p className="text-black font-light text-sm text-center mt-2">
      ✅ They Sign Up & Use Zynth – Your friend generates and exports a presentation.
      </p>
      <p className="text-black font-light text-sm text-center mt-2">
      ✅ You Get Rewarded! – Earn discounted exports.
      </p>

      <div className="mt-8 flex flex-col md:flex-row gap-6">
        {/* Refer a Friend */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-96">
          <img src={addfriend} alt="Refer a Friend" className="w-12 mx-auto" />
          <h2 className="text-xl font-bold text-center mt-4">REFER A FRIEND</h2>
          <p className="text-[#4A4B4D] text-center font-normal text-sm mt-2">
            Send a referral email or copy the referral link and share with your friends.
          </p>

          <input
            type="email"
            placeholder="Friend’s email"
            value={referralEmail}
            onChange={(e) => setReferralEmail(e.target.value)} // ✅ Makes input controlled
            className="w-full mt-4 p-3 border text-[#4A4B4D66] text-xs rounded-lg bg-[#E1E3E5] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-4 mt-[1.05rem] justify-between p-2">
          <button 
    disabled={referralEmail.length === 0}
    className={`flex flex-row w-[50%] items-center justify-center gap-2 py-2 text-sm rounded-lg shadow transition 
        ${referralEmail.length === 0 
            ? "bg-gray-400 border-gray-400 text-gray-200 cursor-not-allowed" 
            : "text-white hover:bg-[#274a89] hover:border-[#3667B2] bg-[#3667B2] border border-[#3667B2] cursor-pointer"
        }`
    }
    onClick={handleEmailClick}
>
    <img src={button1} alt="Refer a Friend" className="w-4" />
    Send Email
</button>

            <button
        className="flex flex-row w-[50%] bg-gray-200 items-center justify-center gap-2 hover:bg-gray-300  text-black py-3 text-sm rounded-lg shadow "
        onClick={handleReferralClick}
      >
        <img src={button2} alt="Copy Link" className="w-4 text-white" />
        {copySuccess ? "Copied!" : "Copy Link"}
      </button>
          </div>
        </div>
        {/* Rewards */}
        <div className="bg-white   shadow-lg rounded-2xl p-6 w-full md:w-96 relative ">
          
          <img src={image1} alt="Shadow Left" className="absolute left-4 top-6 w-20 " />
          <img src={image2} alt="Shadow Right" className="absolute right-4 top-6 w-20 " />
          <img src={refer} alt="Rewards" className="w-12 mx-auto" />
          <h2 className="text-xl font-bold text-center mt-4">REWARDS</h2>
          <p className="text-[#4A4B4D] text-center font-normal text-sm mt-2">
            Earn 1 credit for every successful referral.
          </p>
          {userPlan === "free" ? (
            <p className="text-[#4A4B4D] text-center font-normal text-sm mt-[2.8rem]">
              1 credit = {currency} {freeCredit}
            </p>
          ) : (
            <p className="text-[#4A4B4D] text-center font-normal text-sm mt-10">
            1 credit = {currency} {proCredit}
            </p>
          )}

          <div className="flex justify-between mt-[0.58rem]">
            <div className="text-center">
              <p className="text-[#4A4B4D] text-xs p-2">Successful Referrals</p>
              <div className="bg-white border border-gray-200 p-1 rounded-lg text-lg font-bold min-w-[50px] min-h-[40px] flex items-center justify-center">{successfulReferrals}</div>
            </div>
            <div className="text-center">
              <p className="text-[#4A4B4D] text-xs p-2">Referral Credits Left</p>
              <div className="bg-white border border-gray-200 p-1 rounded-lg text-lg font-bold min-w-[50px] min-h-[40px] flex items-center justify-center">{referralCredits}</div>
            </div>
            </div>
          </div>
        </div>

      </div>
  
  );
}
