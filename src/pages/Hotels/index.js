import './styles/index.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import fetchData from './helpers/fetchData';
import formatPrice from './helpers/formatPrice';
import isBottom from './helpers/isBottom';
import findRegions from './helpers/findRegions';
import filterHotels from './helpers/filterHotels';
import calculateRemainingHeight from './helpers/calculateRemainingHeight';
import { HOTELS_FETCH_LIMIT, HOTELS_FETCH_URL } from './constants';

function Hotels(props) {
  const [regions, setRegions] = useState({});
  const [selectedRegion, setSelectedRegion] = useState();
  const [hotels, setHotels] = useState([]);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);
  const isLastQueryRef = useRef(false);
  const offsetRef = useRef(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (event) => {
    if (
      isLastQueryRef.current || !isHotelsLoading || 
      !isBottom(wrapperRef.current)
    ) return;

    setIsHotelsLoading(true);
  };

  const fetchMoreData = () => {
    return fetchData({ 
      url: HOTELS_FETCH_URL, 
      offset: offsetRef.current, 
      limit: HOTELS_FETCH_LIMIT
    })
    .then((requestHotels) => {
      offsetRef.current += HOTELS_FETCH_LIMIT; 
      const nextRegions = findRegions(requestHotels);
      setRegions({ ...regions, ...nextRegions });
      setHotels((hotels) => {
        return [ ...hotels, ...requestHotels ];
      });
      isLastQueryRef.current = requestHotels.length !== HOTELS_FETCH_LIMIT;
      setIsHotelsLoading(false);

      return {
        isLastQuery: isLastQueryRef.current,
      }
    })
    .then((props) => {
      const { isLastQuery } = props;
      if (
        calculateRemainingHeight(wrapperRef.current) > 0 && 
        !isLastQuery
      ) {
        setIsHotelsLoading(true);
      }
    })
  }
  

  useEffect(() => {
    if (!isHotelsLoading) return;
    fetchMoreData();
  }, [isHotelsLoading]);

  const handleRegionChange = useCallback((event) => {
    setSelectedRegion(event.target.value);
    if (isLastQueryRef.current) return;
    setImmediate(() => {
      if (calculateRemainingHeight(wrapperRef.current) > 0) {
        setIsHotelsLoading(true);
      }
    });
  }, [selectedRegion]);

  return (
    <div className='hotels' ref={wrapperRef}>
      {hotels.length > 0 && (
        <select 
          disabled={isHotelsLoading}
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
