import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const resolvers = {
  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      const { fullName, phoneNumber, address, employer, netWorth, email, password } = input;
     
      const newUser: IUser = new User({ fullName, phoneNumber, address, employer, netWorth, email, password, isAdmin: false });
      await newUser.save();
     
      const token = jwt.sign({ id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin }, JWT_SECRET, { expiresIn: '1d' });

      return { token, user: newUser };
    },

    loginUser: async (_: any, { input }: { input: any }) => {
      const { email, password } = input;
      
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        throw new AuthenticationError('Invalid email or password');
      }
      
      const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });
      return { token, user };
    },

    createUser: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user || !user.isAdmin) {
        throw new ForbiddenError('Access denied');
      }
      const newUser: IUser = new User({ ...input, isAdmin: false });
      await newUser.save();
      return newUser;
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user || !user.isAdmin) {
        throw new ForbiddenError('Access denied');
      }
      const updatedUser = await User.findByIdAndUpdate(id, input, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },

    deleteUser: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user || !user.isAdmin) {
        throw new ForbiddenError('Access denied');
      }
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error('User not found');
      return { message: 'User deleted successfully' };
    }
  },

  Query: {
    me: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await User.findById(user.id);
    },

    allUsers: async (_: any, __: any, { user }: { user: any }) => {
      if (!user || !user.isAdmin) {
        throw new ForbiddenError('Access denied');
      }
      return await User.find();
    }
  }
};
