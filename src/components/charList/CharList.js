import './charList.scss';
import {Component, useState, useEffect, useRef} from 'react'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [error, setError] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charsEnded, setCharsEnded] = useState(false);
    const [selectedCharIndex, setSelectedCharIndex] = useState(null);

    let charRefs = useRef([]);

    const marvelService = new MarvelService();

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharsEnded(ended);
    }

    const onCharsLoading = () => {
        setNewItemLoading(true);
        setError(false);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const onUpdateChars = (offset) => {
        onCharsLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError);
    }

    useEffect(onUpdateChars, []);

    const onScrollUpdateChars = () => {
        if (offset > 210 && window.scrollY + window.innerHeight > document.body.scrollHeight) {
            onUpdateChars(offset);
        }
    }

    const setCharRef = (elem) => {
        charRefs.current.push(elem);
    }

    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.onScrollUpdateChars);
    // }

    const onSetSelectedChar = (activeCharId, newSelectedCharIndex) => {
        if (selectedCharIndex !== null) {
            charRefs.current[selectedCharIndex].classList.remove('char__item_selected');
        }
        props.onSetSelectedChar(activeCharId);
        charRefs.current[newSelectedCharIndex].classList.add('char__item_selected');
        charRefs.current[newSelectedCharIndex].focus();
        setSelectedCharIndex(newSelectedCharIndex);
    }

    let charsElements = chars.map((char, i) => {
        const thumbnailStyle = {objectFit: 'cover'};
        if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            thumbnailStyle.objectFit = 'contain';
        }
        return (
            <li key={char.id} className="char__item"
                onClick={() => onSetSelectedChar(char.id, i)}
                onFocus={() => onSetSelectedChar(char.id, i)}
                ref={setCharRef}
                tabIndex={0}>
                <img style={thumbnailStyle} src={char.thumbnail} alt={char.name}/>
                <div className="char__name">{char.name}</div>
            </li>
        )
    });

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = (!loading && !error) ? charsElements : null;

    return (
        <div className="char__list">
            {spinner}
            <ul className="char__grid">
                {errorMessage}
                {content}
            </ul>
            <button onClick={() => onUpdateChars(offset)}
                    disabled={newItemLoading}
                    style={{'display': charsEnded ? 'none' : 'block'}}
                    className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
}

CharList.propTypes = {
    onSetSelectedChar: PropTypes.func.isRequired
}

export default CharList;