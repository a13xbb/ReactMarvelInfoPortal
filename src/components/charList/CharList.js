import './charList.scss';
import {Component} from 'react'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import PropTypes from 'prop-types';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        newItemLoading: false,
        error: false,
        offset: 210,
        charsEnded: false,
        selectedCharIndex: null
    }

    charRefs = [];

    marvelService = new MarvelService();

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({chars, offset}) => {
            return {
                chars: [...chars, ...newChars],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charsEnded: ended
            }
        })
    }

    onCharsLoading = () => {
        this.setState({
            newItemLoading: true,
            error: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onUpdateChars = (offset) => {
        this.onCharsLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onScrollUpdateChars = () => {
        if (this.state.offset > 210 && window.scrollY + window.innerHeight > document.body.scrollHeight) {
            this.onUpdateChars(this.state.offset);
        }
    }

    setCharRef = (elem) => {
        this.charRefs.push(elem);
    }

    componentDidMount() {
        this.onUpdateChars();
        // window.addEventListener('scroll', this.onScrollUpdateChars)
    }

    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.onScrollUpdateChars);
    // }

    onSetSelectedChar = (activeCharId, newSelectedCharIndex) => {
        if (this.state.selectedCharIndex !== null) {
            this.charRefs[this.state.selectedCharIndex].classList.remove('char__item_selected');
        }
        this.props.onSetSelectedChar(activeCharId);
        this.charRefs[newSelectedCharIndex].classList.add('char__item_selected');
        this.charRefs[newSelectedCharIndex].focus();
        this.setState({
            selectedCharIndex: newSelectedCharIndex
        })
    }

    render() {
        const {chars, loading, error, offset, newItemLoading, charsEnded} = this.state;
        let charsElements = chars.map((char, i) => {
            const thumbnailStyle = {objectFit: 'cover'};
            if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                thumbnailStyle.objectFit = 'contain';
            }
            return (
                <li key={char.id} className="char__item"
                    onClick={() => this.onSetSelectedChar(char.id, i)}
                    onFocus={() => this.onSetSelectedChar(char.id, i)}
                    ref={this.setCharRef}
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
                <button onClick={() => this.onUpdateChars(offset)}
                        disabled={newItemLoading}
                        style={{'display': charsEnded ? 'none' : 'block'}}
                        className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onSetSelectedChar: PropTypes.func.isRequired
}

export default CharList;