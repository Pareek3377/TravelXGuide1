import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext.jsx";
import Swal from "sweetalert2";
import { chatSession } from '../service/AIModal.jsx'; // your AI service

import "react-toastify/dist/ReactToastify.css";

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

const AI_PROMPT = 'Generate Travel Plan for Location : {location} for {totalDays} Days for {traveler} with a {budget} budget, Give me a Hotels options list with HotelName,Hotel address,Price, hotel image url,geo coordinates,rating,descriptions and suggest itinerary with placeName,Place Details,Place Image Url, Geo Coordinates,ticket Pricing ,rating,Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.';

function Tours() {
  const { isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    noOfDays: '',
    budget: '',
    traveler: ''
  });
  const [placeInput, setPlaceInput] = useState(""); // typing input
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const OnGenerateTrip = async () => {
    if (!formData.location) {
      toast.error("Please enter a destination!");
      return;
    }
    if (!formData.noOfDays || isNaN(formData.noOfDays) || formData.noOfDays < 1 || formData.noOfDays > 5) {
      toast.error("Enter a valid trip duration (1-5 days)!");
      return;
    }
    if (!formData.budget) {
      toast.error("Please select a budget!");
      return;
    }
    if (!formData.traveler) {
      toast.error("Please select traveler type!");
      return;
    }

    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{totalDays}', formData.noOfDays)
      .replace('{traveler}', formData.traveler)
      .replace('{budget}', formData.budget);

    setLoading(true);
    const toastId = toast.loading("Generating your trip plan...");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-blue-700">Plan Your Dream Trip</h1>
          <p className="mt-4 text-gray-600 text-lg">Personalized AI Trip Planner</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="grid gap-6">
            {/* Destination Input */}
            <div className="relative">
              <label className="font-semibold mb-2 block">Destination</label>
              <input
                type="text"
                placeholder="Enter city or place"
                value={placeInput}
                onChange={(e) => {
                  setPlaceInput(e.target.value);
                  handleInputChange("location", e.target.value); // <- important update
                  fetchSuggestions(e.target.value);
                }}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-20 bg-white border mt-1 w-full rounded-lg shadow max-h-60 overflow-y-auto">
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setPlaceInput(s.description);
                        handleInputChange("location", s.description);
                        setSuggestions([]);
                      }}
                      className="p-4 hover:bg-blue-50 cursor-pointer"
                    >
                      {s.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* No of Days */}
            <div>
              <label className="font-semibold mb-2 block">How many days?</label>
              <input
                type="number"
                placeholder="Enter days (1-5)"
                min="1"
                max="5"
                onChange={(e) => handleInputChange("noOfDays", parseInt(e.target.value))}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="font-semibold mb-2 block">Select Budget</label>
              <div className="grid grid-cols-3 gap-4">
                {SelectBudgetOptions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`p-4 border rounded-lg text-center cursor-pointer ${
                      formData.budget === item.title ? "bg-blue-100 border-blue-400" : ""
                    }`}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traveler */}
            <div>
              <label className="font-semibold mb-2 block">Traveler Type</label>
              <div className="grid grid-cols-2 gap-4">
                {SelectTravelList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleInputChange("traveler", item.people)}
                    className={`p-4 border rounded-lg text-center cursor-pointer ${
                      formData.traveler === item.people ? "bg-green-100 border-green-400" : ""
                    }`}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={OnGenerateTrip}
              disabled={loading}
              className={`w-full p-4 mt-6 rounded-lg text-white font-bold ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Generating Trip..." : "Generate My Trip Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tours;
