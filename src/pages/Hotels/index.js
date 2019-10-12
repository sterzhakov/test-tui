import './styles/index.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import fetchData from './helpers/fetchData';
import formatPrice from './helpers/formatPrice';
import isBottom from './helpers/isBottom';
import findRegions from './helpers/findRegions';
import filterHotels from './helpers/filterHotels';
import calculateRemainingHeight from './helpers/calculateRemainingHeight';
import { HOTELS_FETCH_LIMIT, HOTELS_FETCH_URL } from './constants';

const increaseOffset = (offset) => offset + HOTELS_FETCH_LIMIT;

function Hotels(props) {
  const [regions, setRegions] = useState({});
  const [selectedRegion, setSelectedRegion] = useState();
  const [hotels, setHotels] = useState([]);
  const [offset, setOffset] = useState(-HOTELS_FETCH_LIMIT);
  const [intersectionCount, setIntersectionCount] = useState(0);
  const [isHotelsReady, setIsHotelsReady] = useState(false);
  const [isHotelsFetching, setIsHotelsFetching] = useState(false);
  const [remainingHeight, setRemainingHeight] = useState(0);
  const wrapperRef = useRef(null);

  const handleRegionChange = useCallback((event) => {
    setSelectedRegion(event.target.value);
  }, []);

  const handleScroll = useCallback((event) => {
    if (isHotelsFetching) return;
    if (!selectedRegion) return;
    if (isBottom(wrapperRef.current)) {
      setIntersectionCount((intersectionCount) => intersectionCount + 1);
    };
  }, [isHotelsFetching, selectedRegion]);

  useEffect(() => {
    const nextRemainingHeight = calculateRemainingHeight(wrapperRef.current);
    setRemainingHeight(nextRemainingHeight);
  }, [hotels, intersectionCount, selectedRegion]);

  useEffect(() => {
    if (remainingHeight === 0) return;
    if (isHotelsReady) return;
    console.log('remainingHeight', remainingHeight)
    setIsHotelsFetching(true);
    setOffset(increaseOffset);
  }, [remainingHeight, isHotelsReady]);

  // useEffect(() => {
  //   if (!selectedRegion) return;
  //   if (remainingHeight === 0) return;
  //   setOffset(increaseOffset);
  // }, [selectedRegion, remainingHeight]);

  useEffect(() => {
    if (isHotelsReady) return;
    if (intersectionCount === 0) return;
    if (isHotelsReady) return;
    setIsHotelsFetching(true);
    setOffset(increaseOffset);
  }, [intersectionCount, isHotelsReady]);

  useEffect(() => {
    if (offset < 0) return;
    console.log(`asyncFetchData | offset: ${offset}`);
    const asyncFetchData = async () => {
      const requestHotels = 
        await fetchData({ 
          url: HOTELS_FETCH_URL, 
          offset: offset, 
          limit: HOTELS_FETCH_LIMIT
        });
  
      setHotels((allHotels) => [ ...allHotels, ...requestHotels]);
      if (requestHotels.length !== HOTELS_FETCH_LIMIT) {
        setIsHotelsReady(true);
      }
      setIsHotelsFetching(false);

      const requestRegions = findRegions(requestHotels);
      setRegions((allRegions) => ({ ...allRegions, ...requestRegions }));
    };
    asyncFetchData();
  }, [offset]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll])

  return (
    <div className='hotels' ref={wrapperRef}>
      {hotels.length > 0 && (
        <select 
          disabled={isHotelsFetching}
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
      {isHotelsFetching && (
        <div className='hotels__loader'>
          Hotels loading...
        </div>
      )}
    </div>
  )
};

export default Hotels;
