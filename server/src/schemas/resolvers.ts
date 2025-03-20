import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper function to ensure isAdmin is interpreted as a boolean.
function isAdminUser(user: any): boolean {
  return !!user && (user.isAdmin === true || user.isAdmin === "true");
}

export const resolvers = {
  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      const { fullName, phoneNumber, address, employer, netWorth, email, password } = input;
      // Create new user with isAdmin explicitly set to false.
      const newUser: IUser = new User({
        fullName,
        phoneNumber,
        address,
        employer,
        netWorth,
        email,
        password,
        isAdmin: false,
      });
      await newUser.save();

      // Sign token with isAdmin cast using our helper function.
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, isAdmin: isAdminUser(newUser) },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { token, user: newUser };
    },

    loginUser: async (_: any, { input }: { input: any }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        throw new AuthenticationError('Invalid email or password');
      }
      const token = jwt.sign(
        { id: user._id, email: user.email, isAdmin: isAdminUser(user) },
        JWT_SECRET,
        { expiresIn: '1d' }
      );
      return { token, user };
    },

    createUser: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }
      // Ensure new user is created with isAdmin as a Boolean false.
      const newUser: IUser = new User({ ...input, isAdmin: false });
      await newUser.save();
      return newUser;
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }
      const updatedUser = await User.findByIdAndUpdate(id, input, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },

    deleteUser: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error('User not found');
      return { message: 'User deleted successfully' };
    },
  },

  Query: {
    me: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await User.findById(user.id);
    },

    allUsers: async (_: any, __: any, { user }: { user: any }) => {
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }
      return await User.find();
    },
  },

  // Field resolver for the User type to guarantee isAdmin is returned as a boolean.
  User: {
    isAdmin: (parent: any) => {
      return isAdminUser(parent);
    },
  },
};
