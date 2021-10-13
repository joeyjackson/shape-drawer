import mongoose, { Schema, Model, Document } from "mongoose";
import { VertexSchema, IVertex } from "./vertex";

export interface IShape extends Document {
  color: string;
  vertices: IVertex[];
}

export const ShapeSchema: Schema = new mongoose.Schema({
  color: { type: String, enum: ["black", "red", "blue", "white", "orange"], default: 'black' },
  vertices: { type: [VertexSchema], required: true }
});

export const Shape = mongoose.model<IShape>("Shape", ShapeSchema);
