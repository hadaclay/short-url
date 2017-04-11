const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = process.env.MONGOLAB_URI;

function handleNewURL(request, response) {
  const new_url = request.params.url;

  // First check if URL matches http(s)://example.com format
  if (!isValidURL(new_url)) {
    response.json({ error: 'Invalid URL Supplied' });
    return;
  }

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    // Then check if the url is already in DB
    const urls = db.collection('urls');
    urls
      .find({ original_url: new_url }, { original_url: 1, short_url: 1, _id: 0 })
      .toArray((err, docs) => {
        if (err) throw err;
        
        if (docs.length === 0) {
          const host_url = request.protocol + '://' + request.hostname + '/';
          const new_id = Math.random().toString(36).substr(2, 5);
          const short_url = host_url + new_id;
          const new_entry = {original_url: new_url, short_url: short_url};
          
          response.json(new_entry);
          urls.insert(new_entry);
        }
        
        else response.send(docs[0]);
        
        db.close();
      });
  });
}

function isValidURL(url) {
  const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\//=]*)/);
  return regex.test(url);
}

module.exports = handleNewURL;