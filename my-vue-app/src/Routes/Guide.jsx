import React, { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Star, MapPin, Languages, Clock, IndianRupee, User } from "lucide-react";

// Sample data for 50 random guides with enhanced details
const guides = Array.from({ length: 50 }, (_, index) => ({
  id: `guide-${index + 1}`,
  name: `Guide ${index + 1}`,
  registration: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
  languages: ["English", "Hindi", "Tamil", "Bengali", "Marathi", "Gujarati", "Punjabi", "Telugu"]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2 + Math.floor(Math.random() * 2)),
  destinations: [
    "Agra", "Jaipur", "Goa", "Leh", "Kolkata", 
    "Mumbai", "Delhi", "Varanasi", "Mysore", "Udaipur",
    "Chennai", "Hyderabad", "Kochi", "Shimla", "Darjeeling"
  ]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 2)),
  rating: (Math.random() * 5).toFixed(1),
  price: Math.floor(Math.random() * 2000) + 500,
  experience: Math.floor(Math.random() * 10) + 1,
  description: [
    "Certified tour guide with extensive knowledge of local history and culture.",
    "Specializes in heritage walks and culinary tours.",
    "Provides customized itineraries based on your interests.",
    "Expert in photography tours and hidden gems.",
    "Fluent in multiple languages with excellent communication skills."
  ][Math.floor(Math.random() * 5)],
  image: `https://source.unsplash.com/random/400x400/?portrait,guide,india,person,${index}`,
  available: Math.random() > 0.3,
  toursCompleted: Math.floor(Math.random() * 200) + 50
}));

// Unique destinations and languages for filters
const allDestinations = [...new Set(guides.flatMap(guide => guide.destinations))].sort();
const allLanguages = [...new Set(guides.flatMap(guide => guide.languages))].sort();

function Guide() {
  const [filteredGuides, setFilteredGuides] = useState(guides);
  const [selectedLocation, setSelectedLocation] = useState("All Destinations");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [priceRange, setPriceRange] = useState([500, 2500]);
  const [experienceRange, setExperienceRange] = useState([1, 10]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const filtered = guides.filter((guide) => {
      const matchesLocation =
        selectedLocation === "All Destinations" ||
        guide.destinations.includes(selectedLocation);
      const matchesLanguage =
        selectedLanguage === "All Languages" ||
        guide.languages.includes(selectedLanguage);
      const matchesPrice = 
        guide.price >= priceRange[0] && guide.price <= priceRange[1];
      const matchesExperience = 
        guide.experience >= experienceRange[0] && guide.experience <= experienceRange[1];
      return matchesLocation && matchesLanguage && matchesPrice && matchesExperience;
    });
    setFilteredGuides(filtered);
    setShowFilters(false);
  };

  const handleClear = () => {
    setSelectedLocation("All Destinations");
    setSelectedLanguage("All Languages");
    setPriceRange([500, 2500]);
    setExperienceRange([1, 10]);
    setFilteredGuides(guides);
    setShowFilters(false);
  };

  const openGuideDetails = (guide) => setSelectedGuide(guide);
  const closeGuideDetails = () => setSelectedGuide(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img 
          src="/01.jpg" 
          alt="Tour Guides" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col items-center justify-end pb-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Discover Expert Tour Guides
          </h1>
          <p className="text-lg text-gray-200 text-center max-w-2xl">
            Connect with certified local guides who will bring your travel experience to life
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Destinations</option>
                {allDestinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>All Languages</option>
                {allLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="self-end md:self-auto px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'More Filters'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="500"
                  max="2500"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="500"
                  max="2500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience: {experienceRange[0]} - {experienceRange[1]} years
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={experienceRange[0]}
                  onChange={(e) => setExperienceRange([parseInt(e.target.value), experienceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={experienceRange[1]}
                  onChange={(e) => setExperienceRange([experienceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-4"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleClear}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Search Guides
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredGuides.length} {filteredGuides.length === 1 ? 'Guide' : 'Guides'} Available
          </h2>
          <div className="text-gray-500">
            Sorted by: <span className="font-medium text-gray-700">Rating (Highest First)</span>
          </div>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No guides match your search</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters to find the perfect guide</p>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div 
                key={guide.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="w-full h-64 object-cover"
                  />
                  {guide.available ? (
                    <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Available Now
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Booked
                    </span>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800">{guide.name}</h2>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{guide.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    <span>{guide.destinations.join(", ")}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Languages className="w-4 h-4 mr-1.5" />
                    <span>{guide.languages.join(", ")}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">Experience</div>
                      <div className="font-medium flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" />
                        {guide.experience} yrs
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-500">Price/Day</div>
                      <div className="font-medium flex items-center justify-center">
                        <IndianRupee className="w-4 h-4 mr-1 text-blue-500" />
                        {guide.price}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => openGuideDetails(guide)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guide Details Modal */}
      <Dialog.Root open={!!selectedGuide} onOpenChange={closeGuideDetails}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
            {selectedGuide && (
              <>
                <div className="relative">
                  <img
                    src={selectedGuide.image}
                    alt={selectedGuide.name}
                    className="w-full h-64 object-cover"
                  />
                  <Dialog.Close className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md">
                    <X className="w-5 h-5 text-gray-700" />
                  </Dialog.Close>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Dialog.Title className="text-2xl font-bold text-gray-900">
                        {selectedGuide.name}
                      </Dialog.Title>
                      <p className="text-gray-600">{selectedGuide.registration}</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{selectedGuide.rating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">{selectedGuide.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Specializes in</div>
                              <div className="font-medium">{selectedGuide.destinations.join(", ")}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Languages className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Languages</div>
                              <div className="font-medium">{selectedGuide.languages.join(", ")}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Experience</div>
                              <div className="font-medium">{selectedGuide.experience} years</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <IndianRupee className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-500">Daily Rate</div>
                              <div className="font-medium">₹{selectedGuide.price}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div 
                          key={day} 
                          className={`px-3 py-1.5 rounded-full text-sm ${Math.random() > 0.3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Save for Later
                      </button>
                      <button className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-md">
                        Book This Guide
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

export default Guide;