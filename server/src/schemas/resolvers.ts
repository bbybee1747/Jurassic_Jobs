import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Dinosaur from '../models/Dinosaur';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your_jwt_secret';

function isAdminUser(user: any): boolean {
  return !!user && user.isAdmin === "true";
}

export const resolvers = {
  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      const { fullName, phoneNumber, address, employer, netWorth, email, password } = input;
      const newUser: IUser = new User({
        fullName,
        phoneNumber,
        address,
        employer,
        netWorth,
        email,
        password,
        isAdmin: "false",
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
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
        { id: user._id, email: user.email, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return { token, user };
    },

    createUser: async (_: any, { input }: { input: any }, { user }: { user: any }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }

      const newUser: IUser = new User({
        ...input,
        isAdmin: input.isAdmin === "true" ? "true" : "false",
      });
      await newUser.save();
      return newUser;
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }, { user }: { user: any }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }

      const updatedUser = await User.findByIdAndUpdate(id, input, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    },

    deleteUser: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }

      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) throw new Error('User not found');
      return { message: 'User deleted successfully' };
    },

    purchaseDinosaur: async (_: any, { dinosaurId }: { dinosaurId: string }, { user }: { user: any }) => {
      if (!user) {
        console.error("❌ User not authenticated");
        throw new AuthenticationError('Not authenticated');
      }
    
      // Validate Dinosaur ID format
      if (!dinosaurId || dinosaurId.length !== 24) {
        console.error("❌ Invalid Dinosaur ID:", dinosaurId);
        throw new Error("Invalid Dinosaur ID");
      }
    
      console.log("🚀 purchaseDinosaur Mutation Called with ID:", dinosaurId);
    
      // Find the dinosaur in the database
      const dinosaur = await Dinosaur.findById(dinosaurId);
      if (!dinosaur) {
        console.error("❌ Dinosaur not found in database:", dinosaurId);
        throw new Error('Dinosaur not found');
      }
    
      console.log("✅ Dinosaur found:", dinosaur.species);
    
      // Create a purchase object to be saved
      const purchaseData = {
        dinosaurId: dinosaur._id,
        age: dinosaur.age,
        species: dinosaur.species,
        size: dinosaur.size,
        price: dinosaur.price,
        imageUrl: dinosaur.imageUrl,
        description: dinosaur.description,
        purchasedAt: new Date(),
      };
    
      // Save purchase to user profile
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { $push: { purchases: purchaseData } },
        { new: true }
      );
    
      if (!updatedUser) {
        console.error("❌ User not found in database:", user.id);
        throw new Error('User not found');
      }
    
      console.log("✅ Purchase successful!");
      // Return the purchase data instead of the dinosaur object
      return purchaseData;
    },
  },    
  Query: {
    me: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await User.findById(user.id);
    },

    allUsers: async (_: any, __: any, { user }: { user: any }) => {
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (!isAdminUser(user)) {
        throw new ForbiddenError('Access denied');
      }
      return await User.find();
    }
  },

  User: {
    isAdmin: (parent: any) => {
      return parent.isAdmin;
    },
    purchases: (parent: any) => {
      return parent.purchases;
    }
  },
};
