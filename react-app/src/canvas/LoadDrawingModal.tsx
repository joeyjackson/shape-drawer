import React, { FunctionComponent, useMemo, useState, useEffect, useCallback } from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import { REACT_APP_BACKEND_BASE_URL } from '../App';
import { Drawing } from "./DrawingCanvas";
import InfiniteScroll from 'react-infinite-scroller';

interface Props {
  show: boolean;
  toggle: () => void;
  onSuccess: (drawing: Drawing) => void;
  onError: (err: any) => void;
  pageSize?: number;
}

const debounce = (func: (arg: string) => void, delay: number) => {
  let inDebounce: any;
  return (arg0: string) => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func(arg0), delay);
  }
}

const LoadDrawingModal: FunctionComponent<Props> = ({ show, toggle, onSuccess, onError, pageSize = 20 }) => {
  const [pendingSearchText, setPendingSearchText] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selected, setSelected] = useState<Drawing | undefined>(undefined);

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [items, setItems] = useState<Array<Drawing>>([]);

  const loadPage = useCallback((page: number) => {
    const nameQ = searchText ? `&name=${searchText}` : "";
    const uri = `/api/drawings?skip=${page * pageSize}&limit=${pageSize}${nameQ}`;
    axios.get(uri, { baseURL: REACT_APP_BACKEND_BASE_URL })
    .then((res) => {
      const docs: Array<Drawing> = res.data;
      if (docs.length >= pageSize) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setItems(prev => prev.concat(docs));
    })
    .catch((err) => {
      onError(err);
    });
  }, [pageSize, searchText]);

  const unsetTyping = useMemo(() => {
    return debounce((text) => {
      setIsTyping(false);
      setSearchText(text);
    }, 1000);
  }, []);

  useEffect(() => {
    setIsTyping(true);
    unsetTyping(pendingSearchText);
  }, [pendingSearchText, unsetTyping]);

  useEffect(() => {
    setItems([]);
    loadPage(0);
  }, [loadPage]);

  const loader = useMemo(() => {
    return (
      <div className="d-flex justify-content-center m-3">
        <Spinner className="float-center" animation="border" />
      </div>
    )
  }, []);

  const list = useMemo(() => {
    if (isTyping) {
      return loader;
    } else {
      return (
        <div style={{ height: "20em", overflow: "auto" }}>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadPage}
            hasMore={hasMore}
            loader={loader}
            useWindow={false}
          >
            {items.map((item, i) => {
              return (
                <Card 
                  key={item.name + i} 
                  bg={selected === item ? "primary" : undefined} 
                  style={{ cursor: "pointer" }} 
                  onClick={() => setSelected(item)}
                >
                  <Card.Body>{item.name}</Card.Body>
                </Card>
              );
            })}
          </InfiniteScroll>
        </div>
      );
    }
  }, [isTyping, loadPage, hasMore, items, selected, loader]);

  const loadSelected = useCallback(() => {
    if (selected !== undefined) {
      onSuccess(selected)
    }
    toggle();
  }, [onSuccess, selected, toggle]);

  return (
    <Modal show={show} onHide={toggle}>
      <Modal.Header closeButton>
        <Modal.Title>Load Drawing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl
          size="sm"
          placeholder="Search"
          aria-label="Search Bar"
          aria-describedby="basic-addon2"
          value={pendingSearchText}
          onChange={event => setPendingSearchText(event.target.value)}
        />
        {list}
      </Modal.Body>
      <Modal.Footer>
        <Button size="sm" variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button size="sm" variant="primary" disabled={selected === undefined} onClick={loadSelected}>
          Load
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoadDrawingModal;
