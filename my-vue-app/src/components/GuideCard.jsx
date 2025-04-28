import React from "react";

function GuideCard({ guide }) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-6">
      <img src={guide.image} alt={guide.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{guide.name}</h3>
        <p className="text-sm text-gray-600">
          <strong>Registration No:</strong> {guide.registration}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Languages:</strong> {guide.languages.join(", ")}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Destinations:</strong> {guide.destinations.join(", ")}
        </p>
        <div className="flex items-center justify-between mt-2">
          <button className="text-white bg-red-600 px-4 py-1 rounded hover:bg-red-700">
            Know More
          </button>
          <div className="flex text-yellow-500">
            {"★".repeat(guide.rating)}{"☆".repeat(5 - guide.rating)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideCard;
