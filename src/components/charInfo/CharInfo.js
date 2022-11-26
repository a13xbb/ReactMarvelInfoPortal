import {Component, useEffect, useState} from 'react';
import MarvelService from '../../services/MarvelService';
import './charInfo.scss';
import {Fragment} from 'react/cjs/react.production.min';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import PropTypes from 'prop-types';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService.getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError);
    }

    useEffect(updateChar, [props.charId]);

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = (!loading && !error && char) ? <View char={char}/> : null

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )

}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const comicsList = [];
    for (let i = 0; i < comics.length; i++) {
        if (i >= 10) break;
        comicsList.push(
            <li key={i} className="char__comics-item">
                {comics[i].name}
            </li>
        )
    }

    const thumbnailStyle = {objectFit: 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        thumbnailStyle.objectFit = 'contain';
    }

    return (
        <Fragment>
            <div className="char__basics">
                <img style={thumbnailStyle} src={thumbnail} alt={name}/>
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
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicsList.length > 0 ? null : 'No comics with this character'}
                {comicsList}
            </ul>
        </Fragment>
    )
    
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;