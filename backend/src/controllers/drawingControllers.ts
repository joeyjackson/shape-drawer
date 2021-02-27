import { Drawing, IDrawing } from "../models/drawing";
import { Request, Response } from "express";


export const createDrawing = (req: Request, res: Response) => {
  Drawing.create(req.body, (err: any, doc: IDrawing) => {
    if (err) {
      res.send(err);
    }
    res.json(doc);
  });
}

export const listDrawings = (req: Request, res: Response) => {
  Drawing.find({})
  .exec((err: any, doc: IDrawing[]) => {
    if (err) {
      res.send(err);
    }
    res.json(doc);
  });
}

export const getDrawing = (req: Request, res: Response) => {
  Drawing.findById(req.params.id)
  .exec((err: any, doc: IDrawing | null) => {
    if (err) {
      res.send(err);
    }
    res.json(doc);
  });
}

export const editDrawing = (req: Request, res: Response) => {
  Drawing.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .exec((err: any, doc: IDrawing | null) => {
    if (err) {
      res.send(err);
    }
    res.json(doc);
  });
}

export const deleteDrawing = (req: Request, res: Response) => {
  Drawing.findByIdAndDelete(req.params.id)
  .exec((err: any, doc: IDrawing | null) => {
    if (err) {
      res.send(err);
    }
    res.json(doc);
  });
}

