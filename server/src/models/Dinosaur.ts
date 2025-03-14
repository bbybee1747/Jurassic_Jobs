import mongoose, { Schema, Document } from 'mongoose';

export interface IDinosaur extends Document {
  age: number;
  species: string;
  size: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

const DinosaurSchema: Schema = new Schema(
  {
    age: { type: Number, required: true },
    species: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IDinosaur>('Dinosaur', DinosaurSchema);
