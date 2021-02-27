import mongoose, { Schema, Model, Document } from "mongoose";
import { ShapeSchema, IShape } from "./shape";

export interface IDrawing extends Document {
  name: string;
  width: number;
  height: number;
  shapes: IShape[];
}

export const DrawingSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  shapes: [ShapeSchema],
});

// DrawingSchema.methods.prune = function () {
//   console.log("prune")
// }

export const Drawing: Model<IDrawing> = mongoose.model("Drawing", DrawingSchema);
