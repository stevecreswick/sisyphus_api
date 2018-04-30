class Route {
  constructor( options ) {
    this.callback = options.callback;
    this.response = null;
  }

  assign( router ) {
    router[ this.method.toLowerCase() ]
      .apply( router, [ this.endpoint, this.callback ] );
  }
}


// const getRocks = async () => {
//   return knex('rocks')
//     .select('*');
// };
//
//
// const buildRoute = ( resource ) => {
//
// };

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

class IndexRoute extends Route {
  constructor(options) {
    super(options);

    this.endpoint = '/';
    this.method = 'GET';
  }

  response() {

  }
}

// const indexRoute = async ( req, res ) => {
//     try {
//       const rocks = await getRocks();
//       const serializer = new Serializer( { resource: rocks } );
//       res.send( serializer.serialize );
//     }
//     catch ( err ) {
//       console.log( err );
//       const error = new ToErr( { statusCode: 400 } );
//       res.send( error.reason );
//     }
// };

module.exports = IndexRoute;
