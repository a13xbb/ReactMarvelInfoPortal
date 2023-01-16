import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import { Fragment } from "react/cjs/react.production.min";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";

import "./charInfo.scss";

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  const updateChar = () => {
    const { charId } = props;
    if (!charId) {
      return;
    }

    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  useEffect(updateChar, [props.charId]);

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !loading && !error && char ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  const comicsList = [];
  for (let i = 0; i < comics.length; i++) {
    if (i >= 10) break;
    comicsList.push(
      <li key={i} className="char__comics-item">
        {comics[i].name}
      </li>
    );
  }

  const thumbnailStyle = { objectFit: "cover" };
  if (
    thumbnail ===
    "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
  ) {
    thumbnailStyle.objectFit = "contain";
  }

  return (
    <Fragment>
      <div className="char__basics">
        <img style={thumbnailStyle} src={thumbnail} alt={name} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comicsList.length > 0 ? null : "No comics with this character"}
        {comicsList}
      </ul>
    </Fragment>
  );
};

CharInfo.propTypes = {
  charId: PropTypes.number,
};

export default CharInfo;
