import P5 from "p5";

export type ColorChoice = "black" | "red" | "blue" | "white" | "orange";

export default class Shape {
  static CLOSE_RADIUS = 5;

  _p5: P5;
  color: ColorChoice;
  vertices: P5.Vector[] = [];
  finished: boolean = false;

  constructor(p5: P5, color: ColorChoice) {
    this.color = color;
    this._p5 = p5;
  }

  finishShape() {
    this.finished = true;
  }

  addVertex(point: P5.Vector, forceNoFinish: boolean = false) {
    if (!forceNoFinish && this.vertices.length > 0 && P5.Vector.dist(this.vertices[0], point) < Shape.CLOSE_RADIUS) {
      this.finishShape();
    } else {
      this.vertices.push(point);
    }
    return this.finished;
  }

  draw(pendingVertex?: P5.Vector) {
    const p5 = this._p5;
    p5.push();
    p5.stroke(this.color === "white" && !this.finished ? "black" : this.color);

    if (this.finished) {
      p5.fill(this.color);
      p5.beginShape();
      this.vertices.forEach(v => {
        p5.vertex(v.x, v.y);
      });
      p5.endShape(p5.CLOSE);
    } else {
      for (let i = 0; i < this.vertices.length - 1; i++) {
        const curr = this.vertices[i];
        const next = this.vertices[i+1];
        p5.line(curr.x, curr.y, next.x, next.y);
      }
      if (this.vertices.length > 0 && pendingVertex !== undefined) {
        const last = this.vertices[this.vertices.length - 1];
        p5.line(last.x, last.y, pendingVertex.x, pendingVertex.y);
      }
    }
    p5.pop();
  }
}