import range from '../utils/range';
import sleep from '../utils/sleep';
import generateHotel from './generateHotel';
import { TEST_DATA_COUNT, TETS_FETCH_DELAY } from '../constants';

const hotels = range(TEST_DATA_COUNT).map((number) => generateHotel(number));

const fetchData = async (props) => {
  const { limit, offset } = props;
  await sleep(TETS_FETCH_DELAY);
  return hotels.slice(offset, offset + limit);
};

export default fetchData;
