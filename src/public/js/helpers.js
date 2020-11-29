function isRelationshipSelf(relationshipObj) {
  if (!relationshipObj) {
    return false;
  }

  const codes = _.get(relationshipObj, 'coding');
  const relCode = _.find(codes, (c) => c.code === 'ONESELF');
  return !_.isNil(relCode);
}

const helpers = {
  // Convert strings such as "Hello World" to "HelloWorld"
  coalesceWordsInStr(originalStr) {
    if (_.isEmpty(originalStr)
      || !_.isString(originalStr)) {
      return '';
    }

    const wordsList = _.map(_.split(originalStr, /\s+/), (w) => _.upperFirst(w));
    return _.join(wordsList, '');
  },
  splitStringByCaps(originalStr) {
    if (_.isEmpty(originalStr)
      || !_.isString(originalStr)) {
      return '';
    }

    return originalStr.match(/[A-Z][a-z]+|[0-9]+/g).join(' ');
  },
  showQuerierError(err) {
    let msg;
    if (_.isString(err)) {
      msg = err;
    } else if (err.message) {
      msg = err.message;
    }

    $('#querier-error').text(msg);
  },
  findPersonsNameObj(names) {
    if (!_.isArray(names)
      || _.size(names) < 1) {
      return {};
    }

    const officialName = _.find(names, (n) => n.use === 'official');
    if (officialName) {
      return officialName;
    }

    const usualName = _.find(names, (n) => n.use === 'usual');
    if (usualName) {
      return usualName;
    }

    return names[0];
  },
  getRelationshipText(relationshipObj) {
    if (!relationshipObj) {
      return '';
    }

    const isSelf = isRelationshipSelf(relationshipObj);
    if (isSelf) {
      return 'Self';
    }

    return _.get(relationshipObj, 'text');
  },
  assemblePersonNameStr(nameObj) {
    const text = _.get(nameObj, 'text');
    if (text) {
      return text;
    }

    const namesList = [];
    const familyName = _.get(nameObj, 'family');
    const givenNameArr = _.get(nameObj, 'given');
    let givenName;
    if (!_.isEmpty(givenNameArr)
      && _.isArray(givenNameArr)) {
      givenName = _.join(givenNameArr, ' ');
    }

    if (familyName) {
      namesList.push(familyName);
    }

    if (givenName) {
      namesList.push(givenName);
    }

    return _.join(namesList, ',');
  },
  clearQuerierError() {
    $('#querier-error').empty();
  },
  enableSubmitBtn() {
    $('#submit-button').prop('disabled', false);
  },
  disableSubmitBtn() {
    $('#submit-button').prop('disabled', true);
  },
  showSpinner() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.visibility = 'visible';
  },
  hideSpinner() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.visibility = 'hidden';
  },
  registerCollapsibleClickListener(contentShowToggle, contentBody, displayStyle) {
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
  },
};
