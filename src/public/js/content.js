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

function getCategoryContainer() {

}

const contentFns = {
  displayContents(contents) {
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
      helpers.registerCollapsibleClickListener(contentShowToggle, contentBody, 'block');

      infoDisplayDiv.append(contentShowToggle, [contentBody]);
    }
  },
};