module.exports = class ApplicationError {
  constructor( options ) {
    this.message = options.message || 'An error has occured';
    this.statusCode = options.statusCode || 500;
  }

  serializeError( message ) {
    return JSON.stringify(
      {
        error: {
          code: this.statusCode,
          message: this.message
        }
      }
    )
  }

  get reason() {
    return this.serializeError();
  }
}
