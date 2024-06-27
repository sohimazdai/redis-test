const express = require('express');

const { startDB } = require('./redis');
const { fetchCountries, fetchSpeciesByCountry } = require('./service');

const app = express();

const host = '127.0.0.1';
const port = 4000;

const TTL = 60 * 60; // 60 seconds * 60 minuts = 1 hour;

const C_KEY = 'countries_key';

let cache = null;

startDB()
    .then((res) => cache = res)
    .catch(e => console.error(e));

app.get('/countries', async (req, res) => {
    console.log('!!!! countries');

    console.time(C_KEY);

    const cached = await cache.get(C_KEY);

    if (cached) {
        console.log('!!!! cached countries', cached.length);

        res.status(200).type('application/json').send(cached);
    } else {
        const { data: countries } = await fetchCountries();

        console.log('!!!! countries', countries.length);

        if (countries) {
            await cache.set(C_KEY, countries);
        }

        res.status(200).type('application/json').send(countries);
    }

    console.timeEnd(C_KEY);
});

app.get('/country/:name', async (req, res) => {
    const { params: { name } } = req;

    let tag = `country-${name}`;
    console.time(tag);
    console.log('!!!! ' + tag);


    if (!name) {
        res.status(400).type('text/plain').send('No name provided');
        console.timeEnd(C_KEY);
        return;
    }

    const cached = await cache.get(tag);


    if (cached) {
        console.log('!!!! cached ' + tag, cached.length);

        res.status(200).type('application/json').send(cached);
    } else {
        const { data: result } = await fetchSpeciesByCountry(name);

        console.log('!!!! ' + tag, result.length);

        if (result) {
            await cache.set(tag, result, { EX: TTL });
        }

        res.status(200).type('application/json').send(result);
    }

    console.timeEnd(tag);
});

app.use((req, res, next) => {
    res.status(404).type('text/plain');
    res.send('Not found');
});

app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`);
});