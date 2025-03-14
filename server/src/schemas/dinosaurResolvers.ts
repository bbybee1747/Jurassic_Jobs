import Dinosaur from '../models/Dinosaur';

export const dinosaurResolvers = {
  Query: {
    dinosaurs: async (_: any, args: { sortBy?: string }) => {
      const { sortBy } = args;
      const sortObj: any = {};
      if (sortBy === 'species') {
        sortObj.species = 1;
      } else if (sortBy === 'size') {
        sortObj.size = 1;
      } else if (sortBy === 'price') {
        sortObj.price = 1;
      } else {
        sortObj.age = 1;
      }
      return Dinosaur.find().sort(sortObj);
    },
  },
};
