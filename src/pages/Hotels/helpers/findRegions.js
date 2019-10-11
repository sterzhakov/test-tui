const findRegions = (hotels) => {
  return hotels.reduce((regions, hotel) => {
    return { ...regions, [hotel.region]: null };
  }, {});
};

export default findRegions;
