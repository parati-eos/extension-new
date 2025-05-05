import removeBackground from "../../utils/removeBG";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import uploadFileToS3 from "../inApp/uploadfiletoS3";
import { industrySectorMap } from "../../utils/industrySector";
import { OrganizationData } from "../../@types/orgProfileTypes.ts";
type UserProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    _id: "",
    orgId: "",
    userId: "",
    companyDescription: "",
    tagline: "",
    color: {
      P100: "",
      P75_S25: "",
      P50_S50: "",
      P25_S75: "",
      S100: "",
      F_P100: "",
      F_P75_S25: "",
      F_P50_S50: "",
      F_P25_S75: "",
      F_S100: "",
      SCL: "",
      SCD: "",
    },
    companyName: "",
    industry: "",
    sector: "",
    logo: "",
    websiteLink: "",
    contactEmail: "",
    contactPhone: "",
    linkedinLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [colorData, setColorData] = useState<Record<string, string>>({}); // Stores full color object
  const [sector, setSector] = useState(formData.sector);
  const [industry, setIndustry] = useState(formData.industry);
  const [description, setDescription] = useState("");
  const [productsAndServices, setProductsAndServices] = useState("");
  const countriesList = [
    "United States",
    "Canada",
    "India",
    "United Kingdom",
    "Germany",
  ];
  const [country, setCountry] = useState("");
  const [otherSector, setOtherSector] = useState("");
  const [otherIndustry, setOtherIndustry] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const orgId = sessionStorage.getItem("orgId");
  const userId = sessionStorage.getItem("userEmail");
  const authToken = sessionStorage.getItem("authToken");
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  const [plan, setPlan] = useState<string>("");
  const [pptcount, setpptcount] = useState<number | string>("");
  const [validationErrors, setValidationErrors] = useState<{
    contactPhone?: string;
    linkedinLink?: string;
    contactEmail?: string;
    websiteLink?: string;
  }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#3667B2");
  const [secondaryColor, setSecondaryColor] = useState("#F1B24A");
  const [brandingColors, setBrandingColors] = useState<string[]>([
    "#FFFFFF",
    "#CCD9FF",
    "#99B3FF",
    "#668CFF",
    "#3366FF",
  ]);
  const [originalData, setOriginalData] = useState<OrganizationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      color: {
        P100: primaryColor,
        S100: secondaryColor,
        P75_S25: prevData.color.P75_S25 || "",
        P50_S50: prevData.color.P50_S50 || "",
        P25_S75: prevData.color.P25_S75 || "",
        F_P100: prevData.color.F_P100 || "",
        F_P75_S25: prevData.color.F_P75_S25 || "",
        F_P50_S50: prevData.color.F_P50_S50 || "",
        F_P25_S75: prevData.color.F_P25_S75 || "",
        F_S100: prevData.color.F_S100 || "",
        SCL: prevData.color.SCL || "",
        SCD: prevData.color.SCD || "",
      },
    }));
  }, [primaryColor, secondaryColor]);
  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!orgId) {
        console.error("Error: Organization ID is missing.");
        return;
      }

      setLoading(true);
      const requestUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`;

      try {
        console.log("Fetching Organization Data:", requestUrl);

        const response = await axios.get(requestUrl, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status !== 200)
          throw new Error("Failed to fetch organization data");

        const data = response.data;

        // Ensure colors exist before processing
        if (data.color && typeof data.color === "object") {
          const colorMap = {
            P100: data.color.P100 || "#000000",
            P75_S25: data.color.P75_S25 || "#290000",
            P50_S50: data.color.P50_S50 || "#520000",
            P25_S75: data.color.P25_S75 || "#7A0000",
            S100: data.color.S100 || "#a30000",
          };

          const colorArray = [
            colorMap.P100,
            colorMap.P75_S25,
            colorMap.P50_S50,
            colorMap.P25_S75,
            colorMap.S100,
          ];
          setpptcount(data.pptcount);
          setPlan(data.plan.plan_type);
          setBrandingColors(colorArray);
          setColorData(data.color);
          setPrimaryColor(colorMap.P100);
          setSecondaryColor(colorMap.S100);
        }

        console.log("Fetched Data:", data);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [orgId, authToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/${orgId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = response.data;
        setFormData(data);
        setOriginalData(data); // Store the original data

        if (
          !Object.keys(industrySectorMap).includes(data.sector) &&
          data.sector
        ) {
          setSector("Other");
          setOtherSector(data.sector);
        } else {
          setSector(data.sector);
        }

        if (
          !Object.values(industrySectorMap).flat().includes(data.industry) &&
          data.industry
        ) {
          setIndustry("Other");
          setOtherIndustry(data.industry);
        } else {
          setIndustry(data.industry);
        }

        setInitialLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchData();
  }, [orgId, authToken]);
  // const [error, setError] = useState("");
  const isButtonDisabled = () => {
    const hasErrors = Object.values(validationErrors).some((error) => error);

    // Check LinkedIn errors for each team member
    // const linkedinErrors = teamMembers.some((member) => {
    //   return member.linkedin && !linkedinRegex.test(member.linkedin);
    // });

    return hasErrors || loading || isLoading || isUploading;
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // if (name === 'sector') {
    //   if (value === 'Other') {
    //     setOtherSector('')
    //     setOtherIndustry('')
    //     setIndustryOptions([])
    //   } else {
    //     setIndustryOptions(
    //       industrySectorMap[value as keyof typeof industrySectorMap] || []
    //     )
    //   }
    // }

    if (name === "industry" && value !== "Other") {
      setOtherIndustry("");
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validation logic
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/svg",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const validType = allowedTypes.includes(file.type);
    const validSize = file.size <= maxSize;

    if (!validType) {
      toast.error(
        "Invalid file type. Please upload a PNG, JPEG, or WebP image.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    if (!validSize) {
      toast.error("File size exceeds 5MB. Please upload a smaller file.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsUploading(true);

    try {
      let processedFile = file;

      // Skip background removal for SVGs
      if (file.type !== "image/svg+xml" && file.type !== "image/svg") {
        processedFile = await removeBackground(file);
        if (!processedFile) {
          throw new Error("Failed to process image");
        }
      }

      const uploadedFile = {
        name: processedFile.name,
        type: processedFile.type,
        body: processedFile,
      };

      // Upload file to S3 and get the logo URL
      const url = await uploadFileToS3(uploadedFile);

      if (!url) {
        throw new Error("File upload failed, URL not returned");
      }

      setLogo(url); // Set logo state

      // Fetch colors based on uploaded logo
      const response = await fetchColors(url);

      if (response?.colorData) {
        const colors = response.colorData;

        // Convert color object values into an array
        const colorArray: string[] = [
          colors.P100,
          colors.P75_S25,
          colors.P50_S50,
          colors.P25_S75,
          colors.S100,
        ];

        // Update branding colors
        setBrandingColors([...colorArray]);
        setColorData(colors);
        setPrimaryColor(colors.P100);
        setSecondaryColor(colors.S100);
      }
    } catch (error) {
      console.error("Error uploading logo or fetching colors:", error);
      toast.error("Failed to upload logo and fetch colors", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("changeLogoInput")?.click();

    try {
      if (logo) {
        await fetchColors(logo); // Call fetchColors API on button click
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      setError("Failed to fetch branding colors");
    }
  };

  const [error, setError] = useState("");
  const fetchColors = async (logoUrl: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/fetchColors`,
        { logo: logoUrl },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (response.status === 200) {
        return response.data; // Return color data
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
      setError("Failed to fetch colors");
    }
    return null;
  };
  const validateWebsiteLink = (value: string) => {
    if (value.trim() === "") {
      setError(""); // Clear error if input is empty
      return;
    }
    const websiteRegex =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    if (!websiteRegex.test(value)) {
      return "Please enter a valid website link";
    }
    return undefined;
  };
  const handlevalidationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    // Update the formData state
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Call the corresponding validation function
    let error: string | undefined;
    // if (name === 'contactPhone') error = validateContactPhone(value)
    // if (name === 'linkedinLink') error = validateLinkedInLink(value)
    // if (name === 'contactEmail') error = validateContactEmail(value)
    if (name === "websiteLink") error = validateWebsiteLink(value);

    // Update the validationErrors state
    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    // e.stopPropagation();
    setLoading(true);
    try {
      const sectorData = sector === "Other" ? otherSector : sector;
      const industryData = industry === "Other" ? otherIndustry : industry;

      // Create an object to store only the changed fields
      const changedFields: Partial<OrganizationData> = {};

      // Compare current values with original values
      if (originalData) {
        if (formData.companyName !== originalData.companyName) {
          changedFields.companyName = formData.companyName;
        }
        if (formData.tagline !== originalData.tagline) {
          changedFields.tagline = formData.tagline;
        }
        if (sectorData !== originalData.sector) {
          changedFields.sector = sectorData;
        }
        if (industryData !== originalData.industry) {
          changedFields.industry = industryData;
        }
        if (formData.websiteLink !== originalData.websiteLink) {
          changedFields.websiteLink = formData.websiteLink;
        }
        if (formData.contactPhone !== originalData.contactPhone) {
          changedFields.contactPhone = formData.contactPhone;
        }
        if (formData.contactEmail !== originalData.contactEmail) {
          changedFields.contactEmail = formData.contactEmail;
        }
        if (formData.linkedinLink !== originalData.linkedinLink) {
          changedFields.linkedinLink = formData.linkedinLink;
        }
        if (logo && logo !== originalData.logo) {
          changedFields.logo = logo;
        }
      }

      // Only make the API call if there are actually changed fields
      if (
        Object.keys(changedFields).length > 0 ||
        Object.keys(colorData).length > 0
      ) {
        const updatedData = {
          ...changedFields, // Include only changed fields
          colors: colorData, // Always include full colors data
          orgId: orgId,
          userId: userId,
        };

        await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organizationedit/${orgId}`,
          updatedData,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setLoading(false);
        navigate("/sidebar");
      } else {
        setLoading(false);
        navigate("/sidebar");
      }
    } catch (error: any) {
      console.error("Failed to update profile", error);
      if (error.response?.status === 404) {
        toast.error("Error updating profile data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  const handleSaveColors = async (logoUrl?: string) => {
    setIsLoading(true); // Show loading state
  
    try {
      let colors;
  
      // If a logo URL is provided, fetch colors based on the logo
      if (logoUrl) {
        const logoResponse = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/fetchColors`,
          { logo: logoUrl },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
  
        if (logoResponse.status === 200) {
          colors = logoResponse.data.colorData; // Extract colorData from logo response
        }
      } else {
        // Otherwise, update colors normally with primary and secondary colors
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/data/organizationprofile/organization/updateColors/${orgId}`,
          { primaryColor, secondaryColor },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
  
        if (response.status === 200) {
          colors = response.data.colors; // Extract colors from normal update
        }
      }
  
      // Convert color object values into an array if colors exist
      if (colors) {
        const colorArray: string[] = [
          colors.P100,
          colors.P75_S25,
          colors.P50_S50,
          colors.P25_S75,
          colors.S100,
        
        ];
  
        await setBrandingColors([...colorArray]); // Update state with new colors
        await setColorData(colors); // Update colorData state
        setPrimaryColor(colors.P100);
        setSecondaryColor(colors.S100);
        
      }
    } catch (error) {
      console.error("Error updating branding colors:", error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-11/12 max-w-sm max-h-[95vh] overflow-y-auto relative p-4 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>

        <form className="flex flex-col space-y-3">
          <div>
            <label className="block text-sm font-medium  text-start">
              Email
            </label>
            <input
              title="email"
              type="email"
              className="w-full p-2 border mt-2 focus:border-blue-500 rounded bg-gray-100 cursor-not-allowed"
              value={userId ?? ""} // Fallback to empty string if null
              readOnly
            />{" "}
          </div>

          <div>
            <label className="block text-sm font-medium text-start">
              Organization Name
            </label>
            <input
              title="org name"
              name="companyName"
              type="text"
              className="w-full p-2 border mt-2 focus:border-blue-500 rounded"
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-start">Logo</label>
            <input
              title="logo"
              type="file"
              className="w-full p-2 border mt-2 focus:border-blue-500 rounded"
            />
          </div> */}
          <div className="flex flex-col items-center sm:items-start mt-4">
            <label className="block text-sm font-medium text-start w-full mb-2">
              Logo
            </label>
            <div className="flex w-full flex-row justify-between items-center gap-2">
              {/* Logo / Initials Display */}
              {logo && !isUploading ? (
                <img
                  src={logo}
                  alt="Organization Logo"
                  className="w-20 h-20 rounded-full shadow-md object-contain"
                />
              ) : formData.logo ? (
                <img
                  src={formData.logo}
                  alt="Organization Logo"
                  className="w-20 h-20 rounded-full shadow-md object-contain"
                />
              ) : (
                <div className="w-24 h-24 rounded-full shadow-md bg-blue-400 flex items-center justify-center text-white text-3xl font-bold">
                  {formData.companyName?.charAt(0) || "?"}
                </div>
              )}

              {/* Custom Upload Button */}
              <button
                className={`mt-3 px-4 py-1.5 border border-[#3667B2] text-[#3667B2] 
      hover:bg-[#3667B2] hover:text-white font-medium rounded-md transition 
      ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={(e) => handleButtonClick(e)}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Change Logo"}
              </button>

              {/* Hidden File Input */}
              <input
                type="file"
                id="changeLogoInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-start">
              Branding Colours
            </label>
            {/* Branding Colors Section + Modal */}
            <div
              className="w-full px-1 mt-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-2"
                onClick={(e)=>{
                  e.preventDefault()
                  e.stopPropagation()
                }}
                >
                  <div className="flex-1 h-10 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
                    {isLoading ? (
                      <p className="text-gray-500 flex items-center justify-center h-full text-sm">
                        Loading colors...
                      </p>
                    ) : (
                      <div className="flex h-full w-full">
                        {brandingColors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 h-full transition-transform transform hover:scale-105"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                  type="button"
                    className={`bg-white h-10 border-[#3667B2] border text-[#3667B2] 
        hover:bg-[#3667B2] hover:text-white text-xs font-medium px-3 py-1.5
        rounded-md active:scale-95 transition duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoading) {
                        setTimeout(() => setIsModalOpen(true), 0);
                      }
                    }}
                    disabled={isLoading}
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
                  <div
                    className="bg-white p-5 rounded-2xl shadow-lg w-full max-w-sm max-h-screen overflow-y-auto relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-lg font-bold text-[#091220] mb-5 text-center">
                      Select Branding Colors
                    </h2>

                    <div className="space-y-5">
                      {/* Primary Color */}
                      <div className="space-y-2">
                        <label className="font-semibold text-gray-700">
                          Primary Color:
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
                          />
                          <div className="relative w-10 h-10">
                            <input
                              type="color"
                              value={primaryColor}
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div
                              className="w-10 h-10 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
                              style={{ backgroundColor: primaryColor }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Secondary Color */}
                      <div className="space-y-2">
                        <label className="font-semibold text-gray-700">
                          Secondary Color:
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-lg text-center shadow-sm focus:ring-2 focus:ring-[#3667B2] outline-none"
                          />
                          <div className="relative w-10 h-10">
                            <input
                              type="color"
                              value={secondaryColor}
                              onChange={(e) =>
                                setSecondaryColor(e.target.value)
                              }
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div
                              className="w-10 h-10 rounded-full border border-gray-300 shadow-md cursor-pointer transition-transform hover:scale-110"
                              style={{ backgroundColor: secondaryColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Buttons */}
                    <div className="mt-6 flex justify-between gap-4">
                      <button
                      type="button"
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 py-2 bg-[#3667B2] text-white rounded-lg hover:bg-[#274b8a] transition-all shadow-md"
                        onClick={() => {
                          handleSaveColors();
                          setIsModalOpen(false);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-start">
              Website
            </label>
            <input
              title="website"
              type="url"
              name="websiteLink"
              className={`w-full p-2 border mt-2 focus:border-blue-500 rounded focus:ring-2 ${
                validationErrors.websiteLink
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={formData.websiteLink}
              onChange={handlevalidationChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-start">Plan</label>
            <input
              title="plan"
              type="text"
              className="w-full p-2 border mt-2 focus:border-blue-500 rounded bg-gray-100 cursor-not-allowed"
              value={plan}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-start">
              Available Presentations
            </label>
            <input
              title="available presentations"
              type="number"
              min="0"
              className="w-full p-2 border mt-2 focus:border-blue-500 rounded bg-gray-100 cursor-not-allowed"
              value={pptcount}
              readOnly
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <button
              type="submit"
              className={`px-4 py-3 lg:py-2 lg:w-[12%] rounded-lg mb-2 lg:mb-0 ${
                isButtonDisabled()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#3667B2] text-white hover:bg-white hover:text-[#3667B2] border hover:border-[#3667B2]"
              } active:scale-95 transition transform duration-300`}
              onClick={(e) => handleUpdate(e)}
              // {handleUpdate}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-blue-600 text-sm mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;