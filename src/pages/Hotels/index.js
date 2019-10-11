import './styles/index.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import fetchData from './helpers/fetchData';
import formatPrice from './helpers/formatPrice';
import isBottom from './helpers/isBottom';
import findRegions from './helpers/findRegions';
import filterHotels from './helpers/filterHotels';
import { HOTELS_FETCH_LIMIT, HOTELS_FETCH_URL } from './constants';


function Hotels(props) {
  const [regions, setRegions] = useState({});
  const [selectedRegion, setSelectedRegion] = useState();
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
        const nextRegions = findRegions(nextHotels);
        setRegions({ ...regions, ...nextRegions });

        setHotels([ ...hotels, ...nextHotels ]);
        const isLastQuery = nextHotels.length !== HOTELS_FETCH_LIMIT;
        setIsHotelsLoading(false);
        if (!isLastQuery) {
          window.addEventListener('scroll', handleScroll);
        }
      });
  }, [isHotelsLoading]);

  const handleRegionChange = useCallback((event) => {
    setSelectedRegion(event.target.value);
  });

  return (
    <div className='hotels' ref={hotelsRef}>
      {hotels.length > 0 && (
        <select 
          name='regions' 
          value={selectedRegion} 
          onChange={handleRegionChange}
        >
          <option key='default' value=''>Select region</option>
          {Object.keys(regions).map((region) => {
            return (
              <option key={region} value={region}>
                {region}
              </option>
            )
          })}
        </select>
      )}
      {filterHotels({ region: selectedRegion }, hotels).map((hotel) => (
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
