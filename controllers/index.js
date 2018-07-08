const shortid = require('shortid');

let urls = [];

exports.getOriginalUrl = (req, res) => {
  const element = checkValueExist(req.params.shortUrl);
  if (element) {
    res.status(200).send({original_url: element.original_url});
  } else {
    res.status(400).send({message: "URL not found"});
  }
}

exports.createShortUrl = (req, res) => {
  let {original_url, shorthand} = req.body;

  if (!original_url) {
    res.status(400)
      .send({
        message: "Bad Request, 'original_url' node not found"
      });
  } else {
    if (shorthand) {
      if (checkValueExist(shorthand)) {
        console.log('sh exist');
        res.status(409)
          .send({
            message: "Shorthand exist, give another"
          })
      } else {
        console.log('sh not exist');
        urls.push({original_url, shorthand});
        res.status(200).send({shorthand});
      }
    } else {
      shorthand = shortid.generate();
      console.log(shorthand);
      urls.push({original_url, shorthand});
      res.status(200).send({shorthand});
    }
  }
}

function checkValueExist(value) {
  return (urls.find(element => element.shorthand === value));
}