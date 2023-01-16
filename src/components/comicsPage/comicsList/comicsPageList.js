import "./comicsPageList.scss";
import { Component, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../../services/MarvelService";
import Spinner from "../../spinner/Spinner";
import ErrorMessage from "../../errorMessage/ErrorMessage";
import PropTypes from "prop-types";

const ComicsPageList = (props) => {
  const [comics, setComics] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [comicsEnded, setComicsEnded] = useState(false);
  const [selectedComicIndex, setSelectedComicIndex] = useState(null);

  let charRefs = [];

  const { loading, error, getAllComics } = useMarvelService();

  const onComicsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 8) {
      ended = true;
    }

    setComics((chars) => [...chars, ...newChars]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 8);
    setComicsEnded(ended);
  };

  const onUpdateComics = (offset, initial = false) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset).then(onComicsLoaded);
  };

  useEffect(() => onUpdateComics(offset, true), []);

  const onScrollUpdateChars = () => {
    if (
      offset > 210 &&
      window.scrollY + window.innerHeight > document.body.scrollHeight
    ) {
      onUpdateComics(offset);
    }
  };

  const setCharRef = (elem) => {
    charRefs.push(elem);
  };

  // componentWillUnmount() {
  //     window.removeEventListener('scroll', this.onScrollUpdateChars);
  // }

  const onSetSelectedChar = (activeCharId, newSelectedCharIndex) => {
    if (selectedComicIndex !== null) {
      charRefs[selectedComicIndex].classList.remove("char__item_selected");
    }
    props.onSetSelectedChar(activeCharId);
    charRefs[newSelectedCharIndex].classList.add("char__item_selected");
    charRefs[newSelectedCharIndex].focus();
    setSelectedComicIndex(newSelectedCharIndex);
  };

  const renderItems = (comic) => {
    let charsElements = comic.map((comic, i) => {
      const thumbnailStyle = { objectFit: "cover" };
      if (
        comic.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        thumbnailStyle.objectFit = "contain";
      }
      return (
        <li className="comics__item">
          <Link to={`/comics/${comic.id}`}>
            <img
              src={comic.thumbnail}
              alt={comic.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{comic.title}</div>
            <div className="comics__item-price">9.99$</div>
          </Link>
        </li>
        // <li key={comic.id} className="char__item"
        //     onClick={() => onSetSelectedChar(comic.id, i)}
        //     onFocus={() => onSetSelectedChar(comic.id, i)}
        //     ref={setCharRef}
        //     tabIndex={0}>
        //     <img style={thumbnailStyle} src={comic.thumbnail} alt={comic.title}/>
        //     <div className="char__name">{comic.title}</div>
        // </li>
      );
    });
    return <ul className="comics__grid">{charsElements}</ul>;
  };

  // useEffect(() => console.log('render'));

  const items = renderItems(comics);
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {spinner}
      {errorMessage}
      {items}
      <button
        onClick={() => onUpdateComics(offset)}
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        className="button button__main button__long"
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

ComicsPageList.propTypes = {
  onSetSelectedChar: PropTypes.func.isRequired,
};

export default ComicsPageList;
