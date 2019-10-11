import './styles/index.css';
import React, { useEffect, useState, useRef } from 'react';
import fetchData from './helpers/fetchData';
import formatPrice from './helpers/formatPrice';
import isBottom from './helpers/isBottom';

const HOTELS_FETCH_LIMIT = 10;
const HOTELS_FETCH_URL = '/api/v1/hotels';

function Hotels(props) {
  const [hotels, setHotels] = useState([]);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);
  const hotelsRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (event) => {
    if (!isBottom(hotelsRef.current) || !isHotelsLoading) return;
    window.removeEventListener('scroll', handleScroll);
    setIsHotelsLoading(true);
  };

  useEffect(() => {
    if (!isHotelsLoading) return;
    fetchData({ 
      url: HOTELS_FETCH_URL, 
      offset: hotels.length, 
      limit: HOTELS_FETCH_LIMIT
    })
      .then((nextHotels) => {
        setHotels([ ...hotels, ...nextHotels ]);
        const isLastQuery = nextHotels.length !== HOTELS_FETCH_LIMIT;
        setIsHotelsLoading(false);
        if (!isLastQuery) {
          window.addEventListener('scroll', handleScroll);
        }
      });
  }, [isHotelsLoading]);

  return (
    <div className='hotels' ref={hotelsRef}>
      {hotels.map((hotel) => (
        <div className='hotels__hotel' key={hotel.id}>
          {hotel.id}
          {' | '}
          {hotel.name} in {hotel.region}
          {' by '}
          {formatPrice(hotel.price)}
          {' per day '}
        </div>
      ))}
      {isHotelsLoading && (
        <div className='hotels__loader'>
          Hotels loading...
        </div>
      )}
    </div>
  )
}

export default Hotels;
