'use strict';

(function () {
  var MAIN = document.querySelector('main');
  var ALERT = MAIN.querySelector('.alert');
  var ALERT_TEXT = ALERT.querySelector('.alert__text');
  var DISPLAY_TIME = 5000; // 5c
  var PRELOADER = MAIN.querySelector('.img-upload__message--loading');
  var ERROR = MAIN.querySelector('.img-upload__message--error');
  var ERROR_REPEAT_BUTTON = ERROR.querySelector('.error__link--repeat');
  var ERROR_CANCEL_BUTTON = ERROR.querySelector('.error__link--cancel');

  var show = function (text) {
    hide();
    ALERT_TEXT.textContent = text || '';
    window.utils.showElement(ALERT);
  };

  var hide = function () {
    window.utils.hideElement(ALERT);
  };

  var showMessage = function (message) {
    show(message);
    setTimeout(hide, DISPLAY_TIME);
  };

  var showPreloader = function () {
    window.utils.showElement(PRELOADER);
  };

  var hidePreloader = function () {
    window.utils.hideElement(PRELOADER);
  };

  var showError = function (onCancelClick) {
    window.utils.showElement(ERROR);
    ERROR_REPEAT_BUTTON.addEventListener('click', hideError);
    ERROR_CANCEL_BUTTON.addEventListener('click', onCancelClick);
  };

  var hideError = function (onCancelClick) {
    window.utils.hideElement(ERROR);
    ERROR_REPEAT_BUTTON.removeEventListener('click', hideError);
    ERROR_CANCEL_BUTTON.removeEventListener('click', onCancelClick);
  };

  window.toast = {
    show: show,
    hide: hide,
    showMessage: showMessage,
    showPreloader: showPreloader,
    hidePreloader: hidePreloader,
    showError: showError,
    hideError: hideError
  };
})();
