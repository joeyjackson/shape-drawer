import React, { FunctionComponent, useCallback, useRef, useState, useEffect } from 'react';
import P5 from "p5";
import axios from "axios";
import P5Canvas from './P5Canvas';
import Shape, { ColorChoice } from "./Shape";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import LoadDrawingModal from './LoadDrawingModal';
import Toast from 'react-bootstrap/Toast';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';

// For local testing:
// export const BASE_URL = "http://127.0.0.1:3001";
export const BASE_URL = undefined;

interface Props {
  initWidth?: number;
  initHeight?: number;
}

interface P5Settings {
  color: ColorChoice;
  modalUp: boolean;
}

export type Drawing = {
  _id?: string;
  name: string;
  width: number;
  height: number;
  shapes: Array<{
    color: ColorChoice;
    vertices: Array<{
      x: number;
      y: number;
    }>;
  }>;
}

const DrawingCanvas: FunctionComponent<Props> = ({ initWidth = 600, initHeight = 300 }) => {
  const [color, setColor] = useState<ColorChoice>("black");
  const [height, setHeight] = useState<number>(initHeight);
  const [width, setWidth] = useState<number>(initWidth);
  const [drawingName, setDrawingName] = useState<string>("");
  const [drawingId, setDrawingId] = useState<string | undefined>(undefined);
  const settings = useRef<P5Settings>({ color: color, modalUp: false });
  const shapes = useRef<Shape[]>([]);
  const _p5 = useRef<P5 | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<string>("info");
  
  const toggleLoadModal = useCallback(() => {
    setShowLoadModal(prev => !prev);
  }, []);

  const toggleSaveModal = useCallback(() => {
    setShowSaveModal(prev => !prev);
  }, []);

  const toggleDeleteModal = useCallback(() => {
    setShowDeleteModal(prev => !prev);
  }, []);

  useEffect(() => {
    if (_p5.current !== null) {
      _p5.current.resizeCanvas(width, height);
    }
  }, [width, height]);

  const clear = useCallback(() => {
    shapes.current = [];
  }, []);

  const undo = useCallback(() => {
    if (shapes.current.length > 0) {
      shapes.current.pop();
    }
  }, []);

  const getSavableDrawing = useCallback(() => {
    const _shapes = shapes;
    const d: Drawing = {
      name: drawingName,
      height: height,
      width: width,
      shapes: _shapes.current.map(shape => ({
        color: shape.color,
        vertices: shape.vertices.map((vertex) => ({
          x: vertex.x,
          y: vertex.y
        }))
      })),
    }
    return d;
  }, [drawingName, height, width]);

  const saveDone = useCallback((doc: Drawing) => {
    setIsSaving(false);
    setToastVariant("success");
    setToastMsg(`Save Success. Drawing saved as "${doc?.name}"`);
    setShowToast(true);
  }, []);

  const save = useCallback(() => {
    const doc = getSavableDrawing();

    if (doc.name === "") {
      setToastVariant("warning");
      setToastMsg("Drawing must have name to save");
      setShowToast(true);
    } else {
      setIsSaving(true);
      axios.post(`/api/drawings`, doc, { baseURL: BASE_URL })
      .then((res) => {
        setDrawingId(res?.data?._id);
        saveDone(res?.data);
      })
      .catch((err) => {
        setIsSaving(false);
        if (err?.response?.data?.code === 11000) {
          toggleSaveModal();
        } else {
          console.error("Saving Error:", err.response || err.request || err);
          setToastVariant("danger");
          setToastMsg(`Unexpected error saving drawing. See console for details.`);
          setShowToast(true);
        }
      });
    }
  }, [getSavableDrawing, saveDone]);

  const confirmSave = useCallback(() => {
    toggleSaveModal();
    const doc = getSavableDrawing();

    if (doc.name === "") {
      setToastVariant("warning");
      setToastMsg("Drawing must have name to save");
      setShowToast(true);
    } else {
      setIsSaving(true);
      axios.put(`/api/drawings?name=${doc.name}`, doc, { baseURL: BASE_URL })
      .then((res) => {
        setDrawingId(res?.data?._id);
        saveDone(res?.data);
      })
      .catch((err) => {
        setIsSaving(false);
        console.error("Saving Error:", err.response || err.request || err);
        setToastVariant("danger");
        setToastMsg(`Unexpected error saving drawing. See console for details.`);
        setShowToast(true);
      });
    }
  }, [getSavableDrawing, saveDone]);

  const loadSuccess = useCallback((drawing: Drawing) => {
    if (_p5.current !== null) {
      const p5 = _p5.current;
      setHeight(drawing.height);
      setWidth(drawing.width);
      setDrawingName(drawing.name);
      setDrawingId(drawing._id);
      shapes.current = [];
      drawing.shapes.forEach(shape => {
        shapes.current.push(new Shape(p5, shape.color, shape.vertices));
      });
    }
  }, []);

  const loadError = useCallback((err: any) => {
    console.error("Loading Error:", err.response || err.request || err);
    setToastVariant("danger");
    setToastMsg(`Unexpected error loading drawing. See console for details.`);
    setShowToast(true);
  }, []);

  const _delete = useCallback(() => {
    setIsDeleting(true);
    setShowDeleteModal(false);

    if (drawingId !== undefined) {
      axios.delete(`/api/drawings/${drawingId}`, { baseURL: BASE_URL })
      .then((res) => {
        const doc: Drawing | null = res.data;

        setDrawingId(undefined);
        setIsDeleting(false);
        setToastVariant("success");
        setToastMsg(`Successfully deleted drawing "${drawingName}" (id ${doc?._id})`);
        setShowToast(true);
      })
      .catch((err) => {
        console.error("Deleting Error:", err.response || err.request || err);
        setToastVariant("danger");
        setToastMsg(`Unexpected error deleting drawing. See console for details.`);
        setShowToast(true);
      });
    }
  }, [drawingName, drawingId]);

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
      return nextColor(prev);
    });
  }, []);

  useEffect(() => {
    settings.current.color = color;
  }, [color]);

  useEffect(() => {
    settings.current.modalUp = showDeleteModal || showLoadModal || showSaveModal;
  }, [showDeleteModal, showLoadModal, showSaveModal])

  const sketch = useCallback((p5: P5) => {
    let pendingShape: Shape | null = null;

    p5.setup = () => {
      p5.createCanvas(width, height);
      _p5.current = p5;
    }
  
    const mouseInCanvas = () => {
      return p5.mouseX > 0 
        && p5.mouseX < p5.width 
        && p5.mouseY > 0
        && p5.mouseY < p5.height;
    }

    p5.draw = () => {
      p5.background(255);
      shapes.current.forEach(shape => shape.draw());
      if (pendingShape !== null) {
        pendingShape.draw(mouseInCanvas() ? p5.createVector(p5.mouseX, p5.mouseY) : undefined);
      }
    }

    p5.mouseReleased = () => {
      if (!settings.current.modalUp) {
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
    }

    p5.mouseDragged = () => {
      if (!settings.current.modalUp) {
        if (pendingShape === null) {
          pendingShape = new Shape(p5, settings.current.color);
        }
        const finished = pendingShape.addVertex(p5.createVector(p5.mouseX, p5.mouseY), true);
        if (finished) {
          finishShape();
        }
      }
    }

    const finishShape = () => {
      if (pendingShape !== null) {
        pendingShape.finishShape();
        shapes.current.push(pendingShape);
        pendingShape = null;
      }
    }

    const discardShape = () => {
     pendingShape = null;
    }

    p5.keyPressed = () => {
      if (!settings.current.modalUp) {
        if (p5.keyCode === p5.ENTER) {
          finishShape();
        } else if (p5.keyCode === p5.ESCAPE) {
          discardShape();
        }
      }
    }
  }, []);

  return (
    <>
      {drawingId && <Badge variant="dark">{drawingId}</Badge>}
      <P5Canvas sketch={sketch}/>
      <div className="optionsRow">
        <InputGroup size="sm" className="mx-2 w-25">
          <FormControl
            size="sm"
            placeholder="Drawing Name"
            aria-label="Drawing Name"
            aria-describedby="basic-addon2"
            value={drawingName}
            onChange={event => { setDrawingName(event.target.value); setDrawingId(undefined); }}
          />
          <InputGroup.Append>
            <Button size="sm" variant="primary" disabled={isSaving} onClick={save}>
              {isSaving ? "Saving" : "Save"}
            </Button>
          </InputGroup.Append>
        </InputGroup>

        <Button size="sm" className="mx-2" variant="light" onClick={toggleLoadModal}>
          Load
        </Button>

        <ButtonGroup size="sm" className="mx-2">
          <Button variant="light" onClick={undo}>Undo</Button>
          <Button variant="warning" onClick={clear}>Clear</Button>
          <Button variant="danger" disabled={!!!drawingId || isDeleting} onClick={toggleDeleteModal}>
            {isSaving ? "Deleting" : "Delete"}
          </Button>
        </ButtonGroup>
        
        <ButtonGroup size="sm" className="mx-2">
          <Button variant="secondary" onClick={cycleColor}>Change Color</Button>
          <div className="rounded-right" style={{ backgroundColor: color, width: "2em" }}></div>
        </ButtonGroup>
      </div>
      
      <LoadDrawingModal 
        show={showLoadModal} 
        toggle={toggleLoadModal}
        onSuccess={loadSuccess}
        onError={loadError} />

      <Modal show={showSaveModal} onHide={toggleSaveModal}>
        <Modal.Body>
          Drawing with this name already exists. Overwrite?
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={toggleSaveModal}>
            Cancel
          </Button>
          <Button size="sm" variant="success" onClick={confirmSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={toggleDeleteModal}>
        <Modal.Body>
          Are you sure you want to delete this drawing? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={_delete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast 
        style={{
          position: 'fixed',
          top: 5,
          right: 5,
        }}
        onClose={() => setShowToast(false)} 
        show={showToast} 
        delay={4000} autohide animation
      >
        <Alert className="m-0" variant={toastVariant}>
          {toastMsg}
        </Alert>
      </Toast>
    </>
  );
}

export default DrawingCanvas;
