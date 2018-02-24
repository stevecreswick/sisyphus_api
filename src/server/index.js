const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const morgan = require('koa-morgan');
const cors = require('koa-cors');
const refresh = require('koa-refresh');
const session = require('koa-session');
const passport = require('koa-passport');

const indexRoutes = require('./routes/index');
const rockRoutes = require('./routes/rocks');
const authRoutes = require('./routes/auth');
const store = require('./session');
const app = new Koa();

const PORT = process.env.PORT || 1337;

// All of the Below Can Be Promises added before the request!!!!
// TODO: Add
// Requires User
// Requires Token
// Requires Policy

// Response Time
async function responseTime (ctx, next) {
  console.log('Started tracking response time')
  const started = Date.now()
  await next()
  // once all middleware below completes, this continues
  const ellapsed = (Date.now() - started) + 'ms'
  console.log('Response time is:', ellapsed)
  ctx.set('X-ResponseTime', ellapsed)
}

app.use(responseTime);

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

// CORS
app.use( cors( { methods: ['GET', 'PATCH', 'POST'] } ) );

// authentication
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(indexRoutes.routes());
app.use(rockRoutes.routes());
app.use(authRoutes.routes());

// Do Not Allow for Undefined Methods
// app.use(router.allowedMethods())

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
