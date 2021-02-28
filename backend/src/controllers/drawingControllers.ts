import { Drawing, IDrawing } from "../models/drawing";
import { Request, Response } from "express";

const handleError = (err: any, res: Response) => {
  if (err.code === 11000) {
    res.status(409);
  } else if (err.name === "ValidationError" || err.name === "QueryError") {
    res.status(400);
  } else {
    res.status(500);
  }
  res.send(err);
}

export const createDrawing = (req: Request, res: Response) => {
  Drawing.create(req.body, (err: any, doc: IDrawing) => {
    if (err) {
      handleError(err, res);
    }
    res.json(doc);
  });
}

export const listDrawings = (req: Request, res: Response) => {
  let name_re: RegExp | undefined = undefined;
  let skip: number | undefined = undefined;
  let limit: number | undefined = undefined;
  if (typeof req.query.name === "string") {
    name_re = new RegExp(req.query.name);
  }
  if (typeof req.query.skip === "string") {
    skip = parseInt(req.query.skip);
    if (isNaN(skip)) {
      handleError({ name: "QueryError", message: `Cannot parse query param "skip=${req.query.skip}" as an integer` }, res);
      return
    }
  }
  if (typeof req.query.limit === "string") {
    limit = parseInt(req.query.limit);
    if (isNaN(limit)) {
      handleError({ name: "QueryError", message: `Cannot parse query param "limit=${req.query.limit}" as an integer` }, res);
      return
    }
  }
  const _filter = name_re ? { name: name_re } : {};
  Drawing.find(_filter, undefined, { skip: skip, limit: limit })
  .exec((err: any, doc: IDrawing[]) => {
    if (err) {
      handleError(err, res);
    }
    res.json(doc);
  });
}

export const getDrawing = (req: Request, res: Response) => {
  Drawing.findById(req.params.id)
  .exec((err: any, doc: IDrawing | null) => {
    if (err) {
      handleError(err, res);
    }
    res.json(doc);
  });
}

export const editDrawingById = (req: Request, res: Response) => {
  Drawing.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .exec((err: any, doc: IDrawing | null) => {
    if (err) {
      handleError(err, res);
    }
    res.json(doc);
  });
}

export const editDrawingByName = (req: Request, res: Response) => {
  let name = "";
  if (typeof req.query.name === "string") {
    name = req.query.name;
  }
  if (name === "") {
    handleError({ name: "QueryError", message: `Must specify query param "name"` }, res);
    return
  }

  Drawing.findOneAndUpdate({ name: name }, req.body, { new: true })
  .exec((err: any, doc: IDrawing | null) => {
    if (err) {
      handleError(err, res);
    }
    res.json(doc);
  });
}

export const deleteDrawing = (req: Request, res: Response) => {
  Drawing.findByIdAndDelete(req.params.id)
  .exec((err: any, doc: IDrawing | null) => {
    if (err) {
      handleError(err, res);
    }
    res.json(doc);
  });
}

