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
      return _.get(resource, 'code.text');
    case 'MedicationStatement':
      return _.get(resource, 'medicationCodeableConcept.text');
    case 'Patient': {
      const names = _.get(resource, 'name') || [];
      const nameObj = _.find(names, (n) => n.use === 'official');
      return _.get(nameObj, 'text') || '<NONE>';
    }
    default:
      return 'UNKNOWN';
  }
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
      const { contentShowToggle, contentBody } = createContent(resource);
      const resourceType = _.get(resource, 'resourceType') || 'unknown';
      const categoryContainer = getCategoryContainer(resourceType);
      categoryContainer.append(contentShowToggle, [contentBody]);
    }
  },
};
