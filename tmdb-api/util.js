const rp = require('request-promise-native');
const url = require('url');


function fetchResource(endpoint, query={}) {
    const uri = buildUrl(endpoint, query);

    return rp({
        uri,
        resolveWithFullResponse: true
    });
}


function buildUrl(endpoint, query={}) {
    if (!endpoint) throw new Error('Missing api endpoint');

    return url.format({
        protocol: 'https',
        hostname: 'api.themoviedb.org/3',
        pathname: endpoint,
        query: query
    });
}

module.exports = {
    buildUrl,
    fetchResource
};