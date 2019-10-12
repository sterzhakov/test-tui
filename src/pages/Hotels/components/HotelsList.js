import React, { memo, Fragment } from 'react';
import formatPrice from '../helpers/formatPrice';
import filterHotels from '../helpers/filterHotels';

const HotelsList = memo((props) => {
  const {
    hotels,
    selectedRegion, 
  } = props;
  
  return (
    <Fragment>
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
    </Fragment>
  )
});

export default HotelsList;
