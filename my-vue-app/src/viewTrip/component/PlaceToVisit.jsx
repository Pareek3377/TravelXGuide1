import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function PlacesToVisit({ tripData }) {
    if (!tripData?.itinerary) {
        return <p className="text-gray-500 text-center text-lg mt-5">No itinerary available.</p>;
    }

    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 mt-10'>
            <h2 className='font-bold text-3xl mb-8 text-center text-gray-800'>Places to Visit</h2>
            
            {Object.entries(tripData.itinerary).map(([day, dayInfo]) => (
                <div key={day} className='mt-10'>
                    <h3 className='font-medium text-xl text-gray-800'>{dayInfo.dayName}</h3>
                    <p className='font-medium text-sm text-orange-300'>{dayInfo.bestTimeToVisit || "Best time to visit: All day"}</p>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {dayInfo.places.map((place, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className='h-full'
                            >
                                <Link
                                    to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='block h-full'
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className='bg-white shadow-lg rounded-xl overflow-hidden p-4 h-full flex flex-col justify-between transition-transform hover:shadow-2xl'
                                    >
                                        <img
                                            src={place.placeImageUrl || "/default-place.jpg"}
                                            alt={place.placeName}
                                            className='rounded-lg h-48 w-full object-cover'
                                        />
                                        <div className='mt-3 flex flex-col flex-grow text-center sm:text-left'>
                                            <h2 className='font-semibold text-lg text-gray-800'>{place.placeName}</h2>
                                            <p className='text-sm text-gray-500 mt-1'>📍 {place.placeDetails}</p>
                                            <p className='text-base font-medium text-blue-600 mt-2'>💰 {place.ticketPricing || 'Free'}</p>
                                            <p className='text-base font-medium text-yellow-500 mt-2'>⭐ {place.rating || 'N/A'}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PlacesToVisit;
