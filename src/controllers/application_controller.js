const express = require('express');
const Serializer = require( '../lib/serializer' );
const ToErr = require( '../lib/error' );

const environment = process.env.NODE_ENV || 'development';

const config = require('../../knexfile.js')[ environment ];
const knex = require('knex')( config );

const routeClass = require( './routes/index' );

// TODO: Make DB Methods Dynamic
const getRocks = async () => {
  return knex('rocks')
    .select('*');
};

const indexRoute = async ( req, res ) => {
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
};

class ApplicationController {
  constructor( options ) {
    this.baseUrl = options.baseUrl || '/';
    this.permitted = options.permitted || [];
    this.sortable = options.sortable || [];
    this.actions = options.actions || [];
    this.router = this.buildRoutes();
  }

  buildRoutes() {
    const router = express.Router();

    // USING INDEX ROUTE CLASS
    const index = ( req, res ) => res.send( 'Hello, world' );
    const testRoute = new routeClass( { callback: indexRoute } );
    testRoute.assign( router );

    // router.get( '/', testRoute );

    return router;
  }

  get routes() {
    return this.router;
  }
}

module.exports = ApplicationController;
