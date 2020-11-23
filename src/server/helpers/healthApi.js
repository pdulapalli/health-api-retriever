const _ = require('lodash');
const got = require('got');

const API_URL_BASE_1UP_HEALTH = 'https://api.1up.health';
const PAGINATION_MARKER = '_skip';

async function getPatientId(token) {
  const response = await got.get(
    `${API_URL_BASE_1UP_HEALTH}/fhir/dstu2/patient`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
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

function streamlineInfoPayload(payload) {
  const contents = _.get(payload, 'entry') || [];
  const links = _.get(payload, 'link') || [];
  const nextObj = _.find(links, (l) => l.relation === 'next');
  const nextUrl = _.get(nextObj, 'url') || '';

  let nextPage = null;
  if (nextUrl) {
    const nextUrlObj = new URL(nextUrl);
    if (nextUrlObj.searchParams.has(PAGINATION_MARKER)) {
      nextPage = nextUrlObj.searchParams.get(PAGINATION_MARKER);
    }
  }

  return {
    contents,
    nextPage,
  };
}

async function getInfo({ patientId, token, _skip }) {
  let url = `${API_URL_BASE_1UP_HEALTH}/fhir/dstu2/patient/${patientId}/$everything`;
  if (_skip) {
    url += `?_skip=${_skip}`;
  }

  const response = await got.get(
    url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
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

  // FIXME:
  const info = streamlineInfoPayload(response.body);
  return info;
}

module.exports = {
  getPatientId,
  getInfo,
};
