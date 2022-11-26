import {Component, useState, useEffect} from 'react';
import './randomChar.scss';
import MarvelService from '../../services/MarvelService';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const RandomChar = () => {
    
    const [char, setChar] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const marvelService = new MarvelService();

    // componentWillUnmount() {
    //     clearInterval(this.timerId);
    // }

    const onCharLoaded = (char) => {
        if (!char.description) {
            char.description = "There is no information about this character";
        } else {
            char.description = truncate(char.description, 225);
        }
        setChar(char);
        setLoading(false);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const onCharLoading = () => {
        setLoading(true);
        setError(false);
    }

    const updateChar = () => {
        onCharLoading();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        marvelService.getCharacter(id)
            .then(onCharLoaded)
            .catch(onError);
    }

    useEffect(updateChar, []);

    function truncate(str, n, useWordBoundary = true ){
        if (str.length <= n) { return str; }
        const subString = str.slice(0, n-1); // the original check
        return (useWordBoundary 
          ? subString.slice(0, subString.lastIndexOf(" ")) 
          : subString) + "...";
    };

    
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                        onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    );
    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    const thumbnailStyle = {
        objectFit: 'cover',
    };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        thumbnailStyle.objectFit = 'contain';
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt={name} className="randomchar__img"
                 style={thumbnailStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    ) 
} 

export default RandomChar;