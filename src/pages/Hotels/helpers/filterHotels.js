const filterHotels = (props, hotels) => {
  const { region } = props;
  if (!region) return hotels;
  return hotels.filter((hotel) => {
    return hotel.region === region;
  });
};

export default filterHotels;
