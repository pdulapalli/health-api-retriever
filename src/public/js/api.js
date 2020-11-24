const baseUrl = `${window.location.protocol}//${window.location.host}`;
const api = {
  async determinePatientIdentifier(token, ptId) {
    let url = `${baseUrl}/patient/identifier`;
    if (ptId) {
      url += `?id=${ptId}`;
    }

    const respRaw = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const { patientId, patientName, error } = await respRaw.json();
    if (error) {
      throw error;
    }

    return {
      patientId,
      patientName,
    };
  },
  async retrievePatientInfo(token, patientId, nextPage) {
    let url = `${baseUrl}/patient/info/${patientId}`;
    if (nextPage) {
      url += `?_skip=${nextPage}`;
    }

    const respRaw = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const { result, error } = await respRaw.json();
    if (error) {
      throw error;
    }

    return result;
  },
};
