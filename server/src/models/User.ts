import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IPurchase {
  dinosaurId: mongoose.Types.ObjectId;
  age: number;
  species: string;
  size: string;
  price: number;
  imageUrl?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends Document {
  fullName: string;
  phoneNumber: string;
  address: string;
  employer: string;
  netWorth: number;
  email: string;
  password: string;
  isAdmin: string;
  purchases: IPurchase[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const PurchaseSchema: Schema = new Schema(
  {
    dinosaurId: { type: Schema.Types.ObjectId, required: true },
    age: { type: Number, required: true },
    species: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  employer: { type: String, required: true },
  netWorth: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: String, default: "false" },
  purchases: { type: [PurchaseSchema], default: [] },
});

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
