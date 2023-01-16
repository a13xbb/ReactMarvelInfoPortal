import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, error, request, clearError } = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apikey = "apikey=a80df0ac698f23176c4bb2e894726027";
  const _defaultCharOffset = 210;
  const _defaultComicOffset = 210;

  const getAllCharacters = async (offset = _defaultCharOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apikey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apikey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const _transformCharacter = (character) => {
    return {
      id: character.id,
      name: character.name,
      description: character.description,
      thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
      homepage: character.urls[0].url,
      wiki: character.urls[1].url,
      comics: character.comics.items,
    };
  };

  const getAllComics = async (offset = _defaultComicOffset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&${_apikey}`
    );
    return res.data.results.map(_transformComic);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${id}?${_apikey}`);
    return _transformComic(res.data.results[0]);
  };

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      description: comic.description || "No description",
      pageCount: comic.pageCount
        ? `${comic.pageCount} pages`
        : "No information about the number of pages",
      thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
      language: comic.textObjects.language || "en-us",
      price: comic.prices.price ? `${comic.prices.price}$` : "Not available",
    };
  };

  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getComic,
    clearError,
  };
};

export default useMarvelService;
