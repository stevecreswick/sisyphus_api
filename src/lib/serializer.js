const R = require('ramda');

module.exports = class Serializer {
  constructor( options ) {
    this.resource = options.resource || {};
    this.statusCode = options.statusCode || 200;

    this.response = {
      status: this.statusCode,
      count: this.resource.length,
      data: this.resource,
      associations: this.associations(),
      ids: this.identifiers(),
    }
  }

  get serialize() {
    return JSON.stringify(
      this.response
    )
  }

  appendix() {
    return { 
      ids: this.identifiers(),

      // children: this.childIds(),
      // parentIds: this.parentIds(),
      // parents: this.parents(),
      // parentsChildren: this.parentsChildren(),
    }
  }

  identifiers() {
    return this.resource.map( (resource) => {
      return resource.id
    } )
  }

  childIds() {
    return R.uniq(this.children().map(child => child.id))
  }

  parentIds() {
    return R.uniq(this.children().map(child => child.parent_id))
  }

  parents() {
    return this.resource.filter((resource) => {
      return this.parentIds().indexOf( resource.id ) !== -1
    })
  }

  children() {
    return this.resource.filter( ( resource ) => {
      return resource.parent_id !== null
    } )
  }

  // TODO: Parents Children and such should be on the front end
  parentsChildren() {
    return this.parents().map((parent) => {
      return this.findChildren(parent.id)
    })
}

  findChildren(id) {
    return this.resource.filter((resource) => {
      return resource.parent_id === id
    })
  }

  associations() {
    return this.parents().map(
      (parent) => {
        return {
          id: parent[ 'id' ],
          children: this.findChildren(parent.id).map(this.onlyIds)
        }
      }
    )
  }

  onlyIds( resource ) {
    return resource.id
  }
}
