import mongoose, { Schema, Model, Document } from "mongoose";
import { ShapeSchema, IShape } from "./shape";

export interface IDrawing extends Document {
  name: string;
  width: number;
  height: number;
  shapes: IShape[];
}

export const DrawingSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 1, unique: true },
  width: { type: Number, required: true, min: 1 },
  height: { type: Number, required: true, min: 1 },
  shapes: [ShapeSchema],
});
// DrawingSchema.plugin(require('mongoose-beautiful-unique-validation'));

// DrawingSchema.methods.prune = function () {
//   console.log("prune")
// }

export const Drawing: Model<IDrawing> = mongoose.model("Drawing", DrawingSchema);
