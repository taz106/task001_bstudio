const express = require('express');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const ctrl = require('./controllers');

const ExtractJwt = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'mysecretkey'
}

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  next(null, jwt_payload);
});

passport.use(strategy);

const app = express();
const port = process.env.port || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.get('/', (req, res) =>
  res.send('Url shortener app is running')
);

app.get('/:shortUrl', ctrl.getOriginalUrl);

app.post("/api/create", passport.authenticate('jwt', { session: false }), ctrl.createShortUrl);

app.use((req, res) => {
  res.status(404).send({message: 'not found'});
})

app.listen(port);
