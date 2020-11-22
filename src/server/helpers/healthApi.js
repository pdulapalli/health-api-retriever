const _ = require('lodash');
const got = require('got');

const API_URL_BASE_1UP_HEALTH = 'https://api.1up.health';

async function getPatientId(token) {
  const response = await got.get(
    `${API_URL_BASE_1UP_HEALTH}/fhir/dstu2/patient`,
    {
      headers: {
        Authorization: `Bearer ${
          token}`,
      },
      throwHttpErrors: false,
      responseType: 'json',
    },
  );

  if (response.statusCode !== 200) {
    const err = new Error('Failed API request');
    err.statusCode = response.statusCode;
    throw err;
  }

  const patientId = _.get(response, 'body.entry[0].resource.id') || '';
  if (_.isEmpty(patientId)) {
    throw new Error('Successful response, but could not extract patient ID');
  }

  return patientId;
}

module.exports = {
  getPatientId,
};
