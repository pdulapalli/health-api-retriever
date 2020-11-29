// Clean up retrieved content and remove redundant info
function generateContentDiv(resource) {
  const resourceType = _.get(resource, 'resourceType') || 'unknown';
  const originalDivHtmlStr = _.get(resource, 'text.div') || '<div></div>';
  const contentBody = $(originalDivHtmlStr);
  contentBody.addClass('content-detail');

  const elsToDelete = [];
  contentBody.children('p').each(function () {
    const textContent = $(this).text();
    if (textContent.indexOf('atient') >= 0
      || helpers.coalesceWordsInStr(textContent) === resourceType) {
      elsToDelete.push($(this));
    }
  });

  for (let i = 0; i < elsToDelete.length; i += 1) {
    elsToDelete[i].remove();
  }

  return contentBody;
}

function getCategoryContainer(category) {
  const existingCategoryContainer = $(`#${category}-body`);
  if (!_.isEmpty(existingCategoryContainer)) {
    return existingCategoryContainer;
  }

  const categoryShowToggle = $(`<button type="button">${helpers.splitStringByCaps(category)}</button>`, {
    id: `${category}-collapsible`,
  });
  categoryShowToggle.addClass('collapsible');

  const categoryBody = $('<div></div>', {
    id: `${category}-body`,
  });

  categoryBody.addClass('content-parent');
  categoryBody.hide();
  helpers.registerCollapsibleClickListener(categoryShowToggle, categoryBody, 'flex');

  const infoDisplayDiv = $('#info-results');
  if (infoDisplayDiv) {
    infoDisplayDiv.append(categoryShowToggle, [categoryBody]);
  }

  return categoryBody;
}

function extractPlainTextContentSummary(resource) {
  const resourceType = _.get(resource, 'resourceType') || 'unknown';
  switch (resourceType) {
    case 'AllergyIntolerance':
      return _.get(resource, 'substance.text');
    case 'Condition':
    case 'Observation':

function extractPlainTextContentSummary(resource) {
  const resourceType = _.get(resource, 'resourceType') || 'unknown';
  const codeableText = _.get(resource, 'code.text') || _.get(resource, 'code.coding[0].display');

  let contentSummary;
  switch (resourceType) {
    case 'AllergyIntolerance':
      contentSummary = _.get(resource, 'substance.text');
      break;
    case 'CarePlan':
      contentSummary = _.get(resource, 'title') || _.get(resource, 'category[0].text');
      break;
    case 'Claim': {
      const type = _.get(resource, 'type.coding[0].code');
      const subType = _.get(resource, 'subType.coding[0].display');
      if (type && subType) {
        contentSummary = `${type} -- ${subType}`;
      } else if (type) {
        contentSummary = type;
      }
    } break;
    case 'Encounter':
      contentSummary = _.get(resource, 'class.display');
      break;
    case 'MedicationStatement':
      contentSummary = _.get(resource, 'medicationCodeableConcept.text') || _.get(resource, 'id');
      break;
    case 'Patient': {
      const names = _.get(resource, 'name') || [];
      const nameObj = _.find(names, (n) => n.use === 'official');
      contentSummary = _.get(nameObj, 'text') || '<NONE>';
      break;
    }
    case 'Condition':
    case 'DiagnosticReport':
    case 'Medication':
    case 'Observation':
    default:
      break;
  }

  return contentSummary || codeableText || 'Unknown';
}

function createContent(resource) {
  const contentShowToggle = $(`<button type="button">${extractPlainTextContentSummary(resource)}</button>`);
  contentShowToggle.addClass('collapsible');

  const contentBody = generateContentDiv(resource);
  contentBody.hide();
  helpers.registerCollapsibleClickListener(contentShowToggle, contentBody, 'block');

  return {
    contentShowToggle,
    contentBody,
  };
}

const contentFns = {
  displayContents(contents) {
    if (!_.isArray(contents)) {
      return;
    }

    for (let i = 0; i < contents.length; i += 1) {
      const { resource } = contents[i];
      const resourceType = _.get(resource, 'resourceType') || 'unknown';
      const { contentShowToggle, contentBody } = createContent(resource);
      const categoryContainer = getCategoryContainer(resourceType);
      categoryContainer.append(contentShowToggle, [contentBody]);
    }
  },
};
