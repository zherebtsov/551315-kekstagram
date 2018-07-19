'use strict';

(function () {
  var CLASS_HIDDEN = 'hidden';

  var generateRandomNumber = function (min, max) {
    if (typeof max === 'undefined') {
      max = min;
      min = 0;
    }
    var randomNum = min + Math.random() * (max + 1 - min);
    return Math.floor(randomNum);
  };

  var createElements = function (data, elementTemplate, cbChangeElement) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (item, index) {
      var element = elementTemplate.cloneNode(true);
      element = cbChangeElement(item, index, element); // правило изменения элемента
      fragment.appendChild(element);
    });
    return fragment;
  };

  var showElement = function (element) {
    if (element.classList.contains(CLASS_HIDDEN)) {
      element.classList.remove(CLASS_HIDDEN);
    }
  };

  var hideElement = function (element) {
    if (!element.classList.contains(CLASS_HIDDEN)) {
      element.classList.add(CLASS_HIDDEN);
    }
  };

  window.utils = {
    generateRandomNumber: generateRandomNumber,
    createElements: createElements,
    showElement: showElement,
    hideElement: hideElement
  };
})();
