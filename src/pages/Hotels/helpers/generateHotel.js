import faker from 'faker';

const generateHotel = () => {
  return {
    id: faker.random.number(),
    name: faker.company.companyName(),
    region: faker.address.city(),
    price: parseFloat(faker.commerce.price()),
  };
};

export default generateHotel;
