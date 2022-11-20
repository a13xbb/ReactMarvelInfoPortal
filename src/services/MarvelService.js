class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apikey =  'apikey=a80df0ac698f23176c4bb2e894726027';
    _defaultOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);
    
        if(!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getAllCharacters = async (offset = this._defaultOffset) => {
        const res = await this.getResource(
            `${this._apiBase}characters?limit=9&offset=${offset}&${this._apikey}`);
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResource(
            `${this._apiBase}characters/${id}?${this._apikey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: character.description,
            thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items
        }
    }
}

export default MarvelService;