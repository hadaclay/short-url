const mongodb = require('mongodb');
const MongoClient =  mongodb.MongoClient;

const url = process.env.MONGOLAB_URI;

function handleRedirect(request, response) {
  const redirect_id = request.params.redirect_id;
  const host_url = request.protocol + '://' + request.hostname + '/';
  const redirect_url = host_url + redirect_id;
  
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    
    const urls = db.collection('urls');
    urls
      .find({ short_url: redirect_url }, { original_url: 1, short_url: 1, _id: 0 })
      .toArray((err, docs) => {
        if (err) throw err;
        
        if (docs.length === 0) {
          response.json({"error": "Invalid Redirect URL"});
          db.close();
          return;
        }
        
        else {
          response.redirect(docs[0].original_url);
          db.close();
        }
      });
  });
}

module.exports = handleRedirect;