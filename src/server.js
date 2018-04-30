const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const ToErr = require( './lib/error' );
const Serializer = require( './lib/serializer' );

const app = express();
const port = process.env.PORT || '8008';
const API_URL =  '/api/v1';

const RocksController = require( './controllers/rocks_controller' );
const ApplicationController = require( './controllers/application_controller' );

const testing = new RocksController( {
    baseUrl: '/rocks',
    permitted: [],
    sortable: [],
    actions: [
      'index', 'show', 'edit', 'complete'
    ]
} );

const appController = new ApplicationController( {
    baseUrl: '/',
    permitted: [],
    sortable: [],
    actions: [
      'index', 'show', 'edit', 'delete'
    ]
} );

// console.log(appController);
// console.log('Router');
// console.log(appController.router);
// console.log('Routes');
// console.log(appController.routes);

// ------------------------
// Database
// ------------------------
// const knex = require('../connection');

const environment = process.env.NODE_ENV || 'development';
const config = require('./../knexfile.js')[ environment ];

const knex = require('knex')( config );

const getRocks = async () => {
  return knex('rocks')
    .select('*');
};

const addRock = async ( rock ) => {
  return knex('rocks')
  .insert(rock)
  .returning('*');
};

const updateRock = async ( id, rock ) => {
  console.log(id)
  console.log(rock)
  return knex('rocks')
    .update(rock)
    .where({ id: parseInt(id) })
    .returning('*');
};

const deleteRock = async (id, rock) => {
  return knex('rocks')
    .delete(rock)
    .where({ id: parseInt(id) })
    .returning('*');
};

// ------------------------
// Middleware
// ------------------------

// Logging
app.use( morgan( 'dev' ) );

// Parse application/json
app.use( bodyParser.json() );

// Parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: true } ) );

app.use( cors() );

// ------------------------
// Rock Controller
// ------------------------
const rocksController = express.Router();

// rocksController.use( ( req, res, next ) => {
//   next();
// } );

rocksController.get(
  '/',
  async ( req, res ) => {
    try {
      const rocks = await getRocks();
      const serializer = new Serializer( { resource: rocks } );
      res.send( serializer.serialize );
    }
    catch ( err ) {
      console.log( err );
      const error = new ToErr( { statusCode: 400 } );
      res.send( error.reason );
    }
  }
);

rocksController.post(
  '/',
  async ( req, res ) => {
    try {
      // TODO: Validate ROCK
      const rock = await addRock( req.body );
      const serializer = new Serializer( { resource: rock } );
      res.send( serializer.serialize );
    }
    catch ( err ) {
      console.log( err );
      const error = new ToErr( { statusCode: 400 } );
      res.send( error.reason );
    }
  }
);

rocksController.patch(
  '/:id',
  async ( req, res ) => {
    try {
      const rock = await updateRock( req.params.id, req.body );
      const serializer = new Serializer( { resource: rock } );
      res.send( serializer.serialize );
    }
    catch ( err ) {
      console.log( err );
      const error = new ToErr( { statusCode: 400 } );
      res.send( error.reason );
    }
  }
);

rocksController.delete(
  '/:id',
  async (req, res) => {
    try {
      const rock = await deleteRock(req.params.id, req.body);
      const serializer = new Serializer({ resource: rock });
      res.send(serializer.serialize);
    }
    catch (err) {
      console.log(err);
      const error = new ToErr({ statusCode: 400 });
      res.send(error.reason);
    }
  }
);
// ------------------------
// Define Routes
// ------------------------
app.get( API_URL, (req, res) => {
  res.send( 'Welcome to Sisyphus' );
} );

app.use( `${ API_URL }/rocks`, rocksController );

app.use( `${ API_URL }/test`, appController.router );

// ------------------------
// Start Server
// ------------------------
app.listen( port, () => {
  console.log( `Application listening on port ${ port }.` );
} );
