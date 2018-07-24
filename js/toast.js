'use strict';

(function () {
  var DISPLAY_TIME = 3500; // 3.5c
  var mainElement = document.querySelector('main');
  var alertElement = mainElement.querySelector('.alert');
  var alertTextElement = alertElement.querySelector('.alert__text');
  var preloaderElement = mainElement.querySelector('.img-upload__message--loading');
  var errorElement = mainElement.querySelector('.img-upload__message--error');
  var errorRepeatButtonElement = errorElement.querySelector('.error__link--repeat');
  var errorCancelButtonElement = errorElement.querySelector('.error__link--cancel');

  var show = function (text) {
    hide();
    alertTextElement.textContent = text || '';
    window.utils.showElement(alertElement);
  };

  var hide = function () {
    window.utils.hideElement(alertElement);
  };

  var showMessage = function (message) {
    show(message);
    setTimeout(hide, DISPLAY_TIME);
  };

  var showPreloader = function () {
    window.utils.showElement(preloaderElement);
  };

  var hidePreloader = function () {
    window.utils.hideElement(preloaderElement);
  };

  var onRepeatButtonClick = function () {
    hideError();
  };

  var showError = function (onCancelClick) {
    window.utils.showElement(errorElement);
    errorRepeatButtonElement.addEventListener('click', onRepeatButtonClick);
    errorCancelButtonElement.addEventListener('click', onCancelClick);
  };

  var hideError = function (onCancelClick) {
    window.utils.hideElement(errorElement);
    errorRepeatButtonElement.removeEventListener('click', onRepeatButtonClick);
    errorCancelButtonElement.removeEventListener('click', onCancelClick);
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
