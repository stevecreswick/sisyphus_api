const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const morgan = require('koa-morgan');
const session = require('koa-session');
const passport = require('koa-passport');

const indexRoutes = require('./routes/index');
const boulderRoutes = require('./routes/boulders');
const authRoutes = require('./routes/auth');
const store = require('./session');


const app = new Koa();
const PORT = process.env.PORT || 1337;

// logging
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream( __dirname + '/access.log',
                                             { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// sessions
app.keys = ['super-secret-key'];
app.use(session({ store }, app));

// body parser
app.use(bodyParser());

// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(indexRoutes.routes());
app.use(boulderRoutes.routes());
app.use(authRoutes.routes());

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
