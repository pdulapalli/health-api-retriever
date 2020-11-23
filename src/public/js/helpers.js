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
  showQuerierError(err) {
    let msg;
    if (_.isString(err)) {
      msg = err;
    } else if (err.message) {
      msg = err.message;
    }

    $('#querier-error').text(msg);
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
