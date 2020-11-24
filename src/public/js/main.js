async function onQuerySubmit(event) {
  event.preventDefault();
  helpers.disableSubmitBtn();
  helpers.clearQuerierError();

  try {
    if (!$(this).valid()) {
      throw new Error('Invalid submission values');
    }

    const submittedValsList = $(this).serializeArray();
    const tokenObj = submittedValsList.find((el) => el.name === 'access-token');
    const patientIdObj = submittedValsList.find((el) => el.name === 'patient-id');

    let patientId;
    if (patientIdObj
      && !_.isEmpty(patientIdObj.value)) {
      patientId = patientIdObj.value;
    }

    const identObj = await api.determinePatientIdentifier(tokenObj.value, patientId);
    const { patientName } = identObj;
    if (!patientId) {
      patientId = identObj.patientId;
    }

    let nextPage = null;
    helpers.showSpinner();
    do {
      const info = await api.retrievePatientInfo(tokenObj.value, patientId, nextPage);
      nextPage = info.nextPage;
      contentFns.displayContents(info.contents);
    } while (nextPage);

    const resultsShowCollapsible = $('#results-collapsible');
    resultsShowCollapsible.text(`Patient Info Results (click to expand) -- ${patientName}`);
    $('#results-collapsible').show();
  } catch (err) {
    console.error(err);
    helpers.showQuerierError(err);
  } finally {
    helpers.enableSubmitBtn();
    helpers.hideSpinner();
  }
}

$(() => {
  $('#querier').on('submit', onQuerySubmit);
  $('#querier').validate({
    rules: {
      'access-token': {
        required: true,
        normalizer(value) {
          return $.trim(value);
        },
      },
      'patient-id': {
        required: false,
        normalizer(value) {
          return $.trim(value);
        },
      },
    },
  });

  helpers.registerCollapsibleClickListener($('#results-collapsible'), $('#info-results'), 'flex');
  $('#results-collapsible').hide();
});
