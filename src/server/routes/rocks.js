const Router = require('koa-router');
const queries = require('../db/queries/rocks');

const router = new Router();
const BASE_URL = `/api/v1/rocks`;

router.get(BASE_URL, async (ctx) => {
  try {
    const rocks = await queries.getAllRocks();

    ctx.body = {
      status: 'success',
      data: rocks
    };
  } catch (err) {
    console.log(err)
  }
});

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const rock = await queries.getSingleRock(ctx.params.id);
    if (rock.length) {
      ctx.body = {
        status: 'success',
        data: rock
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That rock does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
});

router.get(`${BASE_URL}/:id/rocks`, async (ctx) => {
  try {
    const rock = await queries.getRockRocks(ctx.params.id);
    if (rock.length) {
      ctx.body = {
        status: 'success',
        data: rock
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That rock does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
});

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const rock = await queries.addRock(ctx.request.body);
    if (rock.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: rock
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
    const rock = await queries.updateRock(ctx.params.id);

    if (rock.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: rock
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That rock does not exist.'
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

router.patch(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const rock = await queries.updateRock( ctx.params.id, ctx.request.body );

    if (rock.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: rock
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That rock does not exist.'
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
    const rock = await queries.deleteRock(ctx.params.id);
    if (rock.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: rock
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That rock does not exist.'
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
