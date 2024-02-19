import { Drawing, IDrawing } from "../models/drawing";
import { Request, Response } from "express";
import { handleError } from "../errors";

export const createDrawing = (req: Request, res: Response) => {
  Drawing.create(req.body).then((doc) => {
    res.status(200).json(doc);
  }).catch((err: any) => {
    handleError(err, res);
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
      return;
    }
  }
  if (typeof req.query.limit === "string") {
    limit = parseInt(req.query.limit);
    if (isNaN(limit)) {
      handleError({ name: "QueryError", message: `Cannot parse query param "limit=${req.query.limit}" as an integer` }, res);
      return;
    }
  }
  const _filter = name_re ? { name: name_re } : {};
  Drawing.find(_filter, undefined, { skip: skip, limit: limit }).exec().then(doc => {
    res.status(200).json(doc);
  }).catch((err: any) => {
    handleError(err, res);
  });
}

export const getDrawing = (req: Request, res: Response) => {
  Drawing.findById(req.params.id).exec().then(doc => {
    res.status(200).json(doc);
  }).catch((err: any) => {
    handleError(err, res);
  });
}

export const editDrawingById = (req: Request, res: Response) => {
  Drawing.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec().then(doc => {
    res.status(200).json(doc);
  }).catch((err: any) => {
    handleError(err, res);
  });
}

export const editDrawingByName = (req: Request, res: Response) => {
  let name = "";
  if (typeof req.query.name === "string") {
    name = req.query.name;
  }
  if (name === "") {
    handleError({ name: "QueryError", message: `Must specify query param "name"` }, res);
    return;
  }

  Drawing.findOneAndUpdate({ name: name }, req.body, { new: true }).exec().then(doc => {
    res.status(200).json(doc);
  }).catch((err: any) => {
    handleError(err, res);
  });
}

export const deleteDrawing = (req: Request, res: Response) => {
  Drawing.findByIdAndDelete(req.params.id).exec().then(doc => {
    res.status(200).json(doc);
  }).catch((err: any) => {
    handleError(err, res);
  });
}
