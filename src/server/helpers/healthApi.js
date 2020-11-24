const _ = require('lodash');
const got = require('got');

const API_URL_BASE_1UP_HEALTH = 'https://api.1up.health';
const PAGINATION_MARKER = '_skip';

async function getPatientIdentifiers({ token, id }) {
  let url = `${API_URL_BASE_1UP_HEALTH}/fhir/dstu2/patient`;
  let parseDotNotation = 'body.entry[0].resource';
  if (id) {
    url += `/${id}`;
    parseDotNotation = 'body';
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
    const err = new Error('Request failed for getting patient identifiers');
    err.statusCode = response.statusCode;
    throw err;
  }

  const patientId = _.get(response, `${parseDotNotation}.id`) || '';
  if (_.isEmpty(patientId)) {
    throw new Error('Successful response, but could not extract patient ID');
  }

  const names = _.get(response, `${parseDotNotation}.name`) || [];
  const officialNameObj = _.find(names, (n) => n.use === 'official');
  if (_.isEmpty(names)
    || !officialNameObj) {
    throw new Error('Successful response, but could not extract patient name');
  }

  return {
    patientId,
    patientName: officialNameObj.text,
  };
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
    const err = new Error('Request failed for getting patient information');
    err.statusCode = response.statusCode;
    throw err;
  }

  const info = streamlineInfoPayload(response.body);
  return info;
}

module.exports = {
  getPatientIdentifiers,
  getInfo,
};
