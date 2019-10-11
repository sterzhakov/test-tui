import range from '../utils/range';
import sleep from '../utils/sleep';
import generateHotel from './generateHotel';

const hotels = range(45).map(generateHotel);

const fetchData = async (props) => {
  const { limit, offset } = props;
  await sleep(1000);
  return hotels.slice(offset, offset + limit);
};

export default fetchData;
