const axios = require('axios');

const token = '9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee';

const client = new axios.Axios({
    baseURL: 'https://apiv3.iucnredlist.org/api/v3'
});

const fetchCountries = () => {
    return client.get(`/country/list?token=${token}`);
}

const fetchSpeciesByCountry = (country) => {
    return client.get(`/country/getspecies/${country}?token=${token}`);
}

module.exports = { fetchCountries, fetchSpeciesByCountry };