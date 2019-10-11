import faker from 'faker';
import randomFromRange from './randomFromRange';
import { REGIONS } from '../constants';

const generateHotel = (id) => {
  const regionIndex = randomFromRange(0, REGIONS.length - 1);
  return {
    id,
    name: faker.company.companyName(),
    region: REGIONS[regionIndex],
    price: parseFloat(faker.commerce.price()),
  };
};

export default generateHotel;
