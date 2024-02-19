import { Response } from "express";

export const handleError = (err: any, res: Response) => {
  if (err.code === 11000) {
    res.status(409);
  } else if (err.name === "ValidationError" || err.name === "QueryError") {
    res.status(400);
  } else {
    res.status(500);
  }
  res.send(err);
}