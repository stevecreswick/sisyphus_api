const Router = require('koa-router');
const queries = require('../db/queries/boulders');

const router = new Router();
const BASE_URL = `/api/v1/boulders`;

router.get(BASE_URL, async (ctx) => {
  try {
    const boulders = await queries.getAllBoulders();
    ctx.body = {
      status: 'success',
      data: boulders
    };
  } catch (err) {
    console.log(err)
  }
});

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const boulder = await queries.getSingleBoulder(ctx.params.id);
    if (boulder.length) {
      ctx.body = {
        status: 'success',
        data: boulder
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That boulder does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
});

router.get(`${BASE_URL}/:id/boulders`, async (ctx) => {
  try {
    const boulder = await queries.getBoulderBoulders(ctx.params.id);
    if (boulder.length) {
      ctx.body = {
        status: 'success',
        data: boulder
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That boulder does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
});

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const boulder = await queries.addBoulder(ctx.request.body);
    if (boulder.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: boulder
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
});

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const boulder = await queries.updateBoulder(ctx.params.id, ctx.request.body);
    if (boulder.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: boulder
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That boulder does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
});

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const boulder = await queries.deleteBoulder(ctx.params.id);
    if (boulder.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: boulder
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That boulder does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
});

module.exports = router;
