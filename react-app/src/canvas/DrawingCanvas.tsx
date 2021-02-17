import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import P5 from "p5";
import P5Canvas from './P5Canvas';
import Shape, { ColorChoice } from "./Shape";

interface Props {
  width: number;
  height: number;
}

interface P5Settings {
  color: ColorChoice;
}

const DrawingCanvas: FunctionComponent<Props> = ({ width, height }) => {
  const [color, setColor] = useState<ColorChoice>("black");
  const settings = useRef<P5Settings>({ color });

  const nextColor: (prev: ColorChoice) => ColorChoice = (prevColor: ColorChoice) => {
    switch(prevColor) {
      case "black":
        return "red";
      case "red":
        return "blue";
      case "blue":
        return "white";
      case "white":
        return "orange";
      case "orange":
        return "black";
    }
  }
  const cycleColor = useCallback(() => {
    setColor(prev => {
      const c = nextColor(prev);
      settings.current.color = c;
      return c;
    });
  }, []);

  const sketch = useCallback((p5: P5) => {
    const shapes: Shape[] = [];
    let pendingShape: Shape | null = null;

    p5.setup = () => {
      p5.createCanvas(width, height);
    }
  
    const mouseInCanvas = () => {
      return p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height;
    }

    p5.draw = () => {
      p5.background(255);
      shapes.forEach(shape => shape.draw());
      if (pendingShape !== null) {
        pendingShape.draw(mouseInCanvas() ? p5.createVector(p5.mouseX, p5.mouseY) : undefined);
      }
    }

    p5.mouseReleased = () => {
      if (mouseInCanvas()) {
        if (pendingShape === null) {
          pendingShape = new Shape(p5, settings.current.color);
        }
        const finished = pendingShape.addVertex(p5.createVector(p5.mouseX, p5.mouseY));
        if (finished) {
          finishShape();
        }
      } else {
        discardShape();
      }
    }

    p5.mouseDragged = () => {
      if (pendingShape === null) {
        pendingShape = new Shape(p5, settings.current.color);
      }
      const finished = pendingShape.addVertex(p5.createVector(p5.mouseX, p5.mouseY), true);
      if (finished) {
        finishShape();
      }
    }

    const finishShape = () => {
      if (pendingShape !== null) {
        pendingShape.finishShape();
        shapes.push(pendingShape);
        pendingShape = null;
      }
    }

    const discardShape = () => {
     pendingShape = null;
    }

    p5.keyPressed = () => {
      if (p5.keyCode === p5.ENTER) {
        finishShape();
      } else if (p5.keyCode === p5.ESCAPE) {
        discardShape();
      }
    }
  }, []);

  return (
    <>
      <P5Canvas sketch={sketch}/>
      <div className="optionsRow">
        <button type="button" onClick={cycleColor}>Change Color</button>
        <div style={{ backgroundColor: color, width: "1em", height: "1em", margin: "5px" }}></div>
      </div>
    </>
  );
}

export default DrawingCanvas;
