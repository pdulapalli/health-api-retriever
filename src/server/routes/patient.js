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

router.get('/info/:id', async (req, res) => {
  const { params, query } = req;
  if (!params.id) {
    res.status('400').json({
      message: 'Need to supply a patient ID',
    });
    return;
  }

  try {
    const result = await healthApi.getInfo({
      patientId: params.id,
      token: req.token,
      _skip: query._skip,
    });

    res.status('200').json({
      result,
    });
  } catch (err) {
    errorHelper.propagateErrToResp(res, err);
  }
});

module.exports = router;
