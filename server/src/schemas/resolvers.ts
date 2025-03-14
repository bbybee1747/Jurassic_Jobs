import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const resolvers = {
  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      const { fullName, phoneNumber, address, employer, netWorth, email, password } = input;
     
      const newUser: IUser = new User({ fullName, phoneNumber, address, employer, netWorth, email, password });
      await newUser.save();
     
      const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
      
      return { token, user: newUser };
    },
    loginUser: async (_: any, { input }: { input: any }) => {
      const { email, password } = input;
      
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid email or password');
      }
      
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    }
  },
  Query: {
    me: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.id);
    }
  }
};
