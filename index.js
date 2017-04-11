const express = require('express');

const handleNewURL = require('./handleNewURL');
const handleRedirect = require('./handleRedirect');
const app = express();

app.use(express.static('public'));
app.set('port', process.env.PORT || 5000);

app.get('/new', (request, response) => response.json({error: "No URL Specfied"}));
app.get('/:redirect_id?', handleRedirect);
app.get('/new/:url(*)', handleNewURL);

app.listen(app.get('port'));