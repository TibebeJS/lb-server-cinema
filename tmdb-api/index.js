require('dotenv').config()

const { fetchResource } = require('./util');

class Tmdb {

    constructor(options={}) {
        if (!options.apiKey) throw new Error('Missing api key');

        this.apiKey = options.apiKey;
    }

    _fetch(endpoint, query={}) {
        return fetchResource(endpoint, Object.assign({}, query, {
            api_key: this.apiKey
        }));
    }

    searchMovie(text, options={}) {
        if (!text) throw new Error('Missing text query');

        const query = Object.assign({ query: text }, options);

        return this._fetch('/search/movie', query).json();
    }

    discoverMovie() {
        return this._fetch('/discover/movie');
    }

    find(id, source) {
        if (!id) throw new Error('Missing external id');
        if (!source) throw new Error('Missing external source');

        return this._fetch(`/find/${id}`, { external_source: source });
    }

    movieDetails(id) {
        if (!id) throw new Error('Missing id');

        return this._fetch(`/movie/${id}`);
    }

    nowPlayingOnCinema({page, language, region}) {
        return this._fetch('movie/now_playing', {page, language, region});
    }
}

module.exports = Tmdb;