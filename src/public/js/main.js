const baseUrl = window.location.protocol + "//" + window.location.host;

$(() => {
  $('#querier').on('submit', onQuerySubmit);
  $("#querier").validate({
    rules: {
      'access-token': {
        required: true,
        normalizer: function (value) {
          return $.trim(value);
        }
      },
      'patient-id': {
        required: false,
        normalizer: function (value) {
          return $.trim(value);
        }
      }
    }
  });

  registerCollapsibleClickListener($('#results-collapsible'), $('#info-results'), 'flex');
  $('#results-collapsible').hide();
});

function registerCollapsibleClickListener(contentShowToggle, contentBody, displayStyle) {
  if (!contentShowToggle || !contentBody) {
    return;
  }

  contentShowToggle.click(function () {
    $(this).toggleClass('active');
    const contentDisplay = contentBody.css('display');
    if (contentDisplay === displayStyle) {
      contentBody.hide();
    } else {
      contentBody.css('display', displayStyle);
    }
  });
}

function generateContentDiv(resource) {
  const resourceType = _.get(resource, 'resourceType') || 'unknown';
  const originalDivHtmlStr = _.get(resource, 'text.div') || '<div></div>';
  const contentBody = $(originalDivHtmlStr);
  contentBody.addClass('content-detail');

  let elsToDelete = []; // TODO: remove patient name
  contentBody.children('p').each(function () {
    const textContent = $(this).text();
    if (textContent.indexOf('atient') >= 0) {
      elsToDelete.push($(this));
    }
  });

  for (let i = 0; i < elsToDelete.length; i += 1) {
    elsToDelete[i].remove();
  }

  return contentBody;
}

function displayContents(contents) {
  if (!_.isArray(contents)) {
    return;
  }

  const infoDisplayDiv = $('#info-results');
  if (!infoDisplayDiv) {
    return;
  }

  for (let i = 0; i < contents.length; i += 1) {
    const { resource } = contents[i];
    const resourceType = _.get(resource, 'resourceType') || 'unknown';
    const contentShowToggle = $(`<button type="button">${i}-${resourceType}</button>`);
    contentShowToggle.addClass('collapsible');

    const contentBody = generateContentDiv(resource);
    contentBody.hide();
    registerCollapsibleClickListener(contentShowToggle, contentBody, 'block');

    infoDisplayDiv.append(contentShowToggle, [ contentBody ]);
  }
}

async function onQuerySubmit(event) {
  event.preventDefault();
  disableSubmitBtn();
  clearQuerierError();

  try {
    if (!$(this).valid()) {
      throw new Error('Invalid submission values');
    }

    const submittedValsList = $(this).serializeArray();
    const tokenObj = submittedValsList.find(el => el.name === 'access-token');
    const patientIdObj = submittedValsList.find(el => el.name === 'patient-id');

    let patientId;
    if (patientIdObj &&
      !_.isEmpty(patientIdObj.value)) {
      patientId = patientIdObj.value;
    } else {
      patientId = await api.determinePatientId(tokenObj.value);
    }

    let nextPage = null;
    showSpinner();
    do {
      const info = await api.retrievePatientInfo(tokenObj.value, patientId, nextPage);
      nextPage = info.nextPage;
      displayContents(info.contents);
    } while (nextPage);
    $('#results-collapsible').show();
  } catch (err) {
    console.error(err);
    showQuerierError(err);
  } finally {
    enableSubmitBtn();
    hideSpinner();
  }
}

function showQuerierError(err) {
  let msg;
  if (_.isString(err)) {
    msg = err;
  } else if (err.message) {
    msg = err.message;
  }

	$('#querier-error').text(msg);
}

function clearQuerierError() {
	$('#querier-error').empty();
}

function enableSubmitBtn() {
  $("#submit-button").prop('disabled', false);
}

function disableSubmitBtn() {
  $("#submit-button").prop('disabled', true);
}

function showSpinner() {
  const loadingDiv = document.getElementById('loading');
  loadingDiv.style.visibility = 'visible';
}

function hideSpinner() {
  const loadingDiv = document.getElementById('loading');
  loadingDiv.style.visibility = 'hidden';
}