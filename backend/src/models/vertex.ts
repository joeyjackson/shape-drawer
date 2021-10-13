import mongoose, { Schema, Model, Document } from "mongoose";

export interface IVertex extends Document {
  x: number;
  y: number;
}

export const VertexSchema: Schema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
});

export const Vertex = mongoose.model<IVertex>("Vertex", VertexSchema);
