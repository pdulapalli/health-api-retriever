const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const healthApi = require('../helpers/healthApi');
const errorHelper = require('../helpers/error');

router.use('/', authMiddleware);

router.get('/id', async (req, res) => {
  try {
    const patientId = await healthApi.getPatientId(req.token);
    res.status('200').json({
      patientId,
    });
  } catch (err) {
    errorHelper.propagateErrToResp(res, err);
  }
});

module.exports = router;
