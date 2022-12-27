import './charList.scss';
import {Component, useState, useEffect, useRef} from 'react'
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charsEnded, setCharsEnded] = useState(false);
    const [selectedCharIndex, setSelectedCharIndex] = useState(null);

    let charRefs = [];

    const {loading, error, getAllCharacters} = useMarvelService();

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharsEnded(ended);
    }

    const onUpdateChars = (offset, initial=false) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded);
    }

    useEffect(() => onUpdateChars(offset, true), []);

    const onScrollUpdateChars = () => {
        if (offset > 210 && window.scrollY + window.innerHeight > document.body.scrollHeight) {
            onUpdateChars(offset);
        }
    }

    const setCharRef = (elem) => {
        charRefs.push(elem); 
    }

    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.onScrollUpdateChars);
    // }

    const onSetSelectedChar = (activeCharId, newSelectedCharIndex) => {
        if (selectedCharIndex !== null) {
            charRefs[selectedCharIndex].classList.remove('char__item_selected');
        }
        props.onSetSelectedChar(activeCharId);
        charRefs[newSelectedCharIndex].classList.add('char__item_selected');
        charRefs[newSelectedCharIndex].focus();
        setSelectedCharIndex(newSelectedCharIndex);
    }

    const renderItems = (chars) => {
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
        return (
            <ul className="char__grid">
                {charsElements}
            </ul>
        )
    }

    // useEffect(() => console.log('render'));

    const items = renderItems(chars);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
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