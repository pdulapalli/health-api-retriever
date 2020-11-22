const _ = require('lodash');
const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const healthApi = require('../helpers/healthApi');

router.use('/', authMiddleware);

router.get('/id', async (req, res) => {
  try {
    const patientId = await healthApi.getPatientId(req.token);
    res.status('200').json({
      patientId,
    });
  } catch (err) {
    if (err.statusCode) {
      res.status(`${err.statusCode}`).json({
        error: err.message,
      });

      return;
    }

    res.status('500').json({
      error: err.message,
    });
  }
});
module.exports = router;
