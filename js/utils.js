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

  var generateRandomUniqueNumbers = function (qty) {
    var numbers = [];

    for (var i = 0; i < qty; i++) {
      numbers.push(i + 1);
    }

    return shuffleArray(numbers);
  };

  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  var shuffleArray = function (array) {
    var result = array.slice();

    result.sort(compareRandom);

    return result;
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

  var showElement = function (element, classHide) {
    var hide = classHide || CLASS_HIDDEN;
    if (element.classList.contains(hide)) {
      element.classList.remove(hide);
    }
  };

  var hideElement = function (element, classHide) {
    var hide = classHide || CLASS_HIDDEN;
    if (!element.classList.contains(hide)) {
      element.classList.add(hide);
    }
  };

  window.utils = {
    generateRandomNumber: generateRandomNumber,
    createElements: createElements,
    showElement: showElement,
    hideElement: hideElement,
    generateRandomUniqueNumbers: generateRandomUniqueNumbers
  };
})();
