import { useState, useEffect, useContext } from "react";
import daljheel from '../assetss/daljheel.jpg';
import { chatSession } from '../service/AIModal.jsx';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../Context/AppContext.jsx";
import Swal from "sweetalert2";

const API_URL = "https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json";
const API_KEY = "4690a014e7mshe970e24d2ef322fp1b5165jsn2f8db7cebf61";

export const SelectTravelList = [
  { id: 1, title: 'Just Me', desc: "A sole traveler", icon: '🙋🏾‍♀', people: '1' },
  { id: 2, title: 'A couple', desc: "Two travelers", icon: '👫🏾', people: '2' },
  { id: 3, title: 'Family', desc: "A group of fun-loving adventurers", icon: '🏡', people: '3 to 5 people' },
  { id: 4, title: 'Friends', desc: "A bunch of thrill-seekers", icon: '👩‍👩‍👦‍👦', people: '5 to 12 people' }
];

export const SelectBudgetOptions = [
  { id: 1, title: 'Affordable', desc: "Stay conscious of costs", icon: '💵' },
  { id: 2, title: 'Moderate', desc: "Keep cost on the average side", icon: '💰' },
  { id: 3, title: 'Luxury', desc: "Don't worry about cost", icon: '💎' }
];

export const AI_PROMPT = 'Generate Travel Plan for Location : {location} for {totalDays} Days for {traveler} with a {budget} budget, Give me a Hotels options list with HotelName,Hotel address,Price, hotel image url,geo coordinates,rating,descriptions and suggest itinerary with placeName,Place Details,Place Image Url, Geo Coordinates,ticket Pricing ,rating,Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.';

function Tours() {
  const { isLoggedin, userData } = useContext(AppContext);
  const [place, setPlace] = useState("");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isLoggedin || !userData) {
      Swal.fire({
        title: "Login Required",
        text: "You need to log in to access this page.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signup");
        }
      });
    }
  }, [isLoggedin, userData, navigate]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (toastMessage) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const OnGenerateTrip = async () => {
    let message = "";

    if (!formData.location) message = "Please enter a destination!";
    else if (!formData.noOfDays || isNaN(formData.noOfDays) || formData.noOfDays < 1 || formData.noOfDays > 5)
      message = "Enter a valid trip duration (1-5 days)!";
    else if (!formData.budget) message = "Please select a budget!";
    else if (!formData.traveler) message = "Please select a traveler type!";


    setToastMessage(message);
    const toastId = toast.loading("Generating your trip plan...");
    setLoading(true);


    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const aiResponse = await result?.response?.text();
      toast.update(toastId, { 
        render: "Trip successfully generated! 🎉", 
        type: "success", 
        isLoading: false, 
        autoClose: 5000,
        className: 'bg-green-600 text-white'
      });
      navigate(`/trip-plan/${formData.location}/${formData.noOfDays}/${formData.budget}/${formData.traveler}`, {
        state: { tripData: aiResponse }
      });
    } catch (error) {
      console.error("Error generating trip:", error);
      toast.update(toastId, { 
        render: "Failed to generate trip. Please try again.", 
        type: "error", 
        isLoading: false, 
        autoClose: 5000,
        className: 'bg-red-600 text-white'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (input) => {
    if (!input) return setSuggestions([]);

    try {
      const res = await fetch(`${API_URL}?input=${encodeURIComponent(input)}&types=geocode&language=en`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "google-map-places.p.rapidapi.com"
        }
      });
      const data = await res.json();
      setSuggestions(data?.predictions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {showToast && toastMessage && (
        <div className="fixed top-20 right-5 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mt-20">
            Plan Your Dream Trip
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Our AI-powered trip planner will create a personalized itinerary just for you.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 lg:p-12 transition-all duration-300 hover:shadow-2xl">
          <div className="grid gap-12">
            {/* Destination and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Destination Input */}
              <div className="relative">
                <label htmlFor="destination" className="block text-lg font-medium text-gray-700 mb-3">
                  Where do you want to go?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    id="destination"
                    type="text"
                    value={place}
                    placeholder="Enter destination (city, country)"
                    onChange={(e) => {
                      setPlace(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                    className="w-full pl-12 pr-5 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((s, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setPlace(s.description);
                            handleInputChange("location", s.description);
                            setSuggestions([]);
                          }}
                          className="p-4 cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 flex items-center"
                        >
                          <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {s.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Duration Input */}
              <div>
                <label htmlFor="duration" className="block text-lg font-medium text-gray-700 mb-3">
                  How many days?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Number of days (1-5)"
                    onChange={(e) => handleInputChange('noOfDays', parseInt(e.target.value))}
                    className="w-full pl-12 pr-5 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Budget Selection */}
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose your budget</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {SelectBudgetOptions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`p-6 border-2 rounded-xl shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md
                      ${formData.budget === item.title
                        ? "border-blue-500 bg-blue-50 scale-[1.02] ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-blue-300"}`}
                  >
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">{item.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traveler Selection */}
            <div className="animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Who's traveling?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {SelectTravelList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleInputChange('traveler', item.people)}
                    className={`p-6 border-2 rounded-xl shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md
                      ${formData.traveler === item.people
                        ? "border-green-500 bg-green-50 scale-[1.02] ring-2 ring-green-200"
                        : "border-gray-200 hover:border-green-300"}`}
                  >
                    <div className="flex items-center">
                      <span className="text-4xl mr-4">{item.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                        <p className="text-gray-600">{item.desc}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.people}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={OnGenerateTrip}
                disabled={loading}
                className={`px-10 py-5 rounded-xl text-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 hover:shadow-xl hover:scale-105'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate My Trip Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Tours;