'use strict';

(function () {
  var filterElement = document.querySelector('.img-filters');
  var formElement = filterElement.querySelector('.img-filters__form');
  var filterControlElements = formElement.querySelectorAll('.img-filters__button');
  var ACTIVE_CLASS = 'img-filters__button--active';
  var NEW_FILTER_PICTURE_QUANTITY = 10;
  var pictures = [];

  var init = function (data) {
    window.utils.showElement(filterElement, 'img-filters--inactive');
    pictures = data;
  };

  var removeActiveClass = function () {
    filterControlElements.forEach(function (control) {
      control.classList.remove(ACTIVE_CLASS);
    });
  };

  var filterNew = function (data) {
    var indices = window.utils.generateRandomUniqueNumbers(data.length - 1).slice(0, NEW_FILTER_PICTURE_QUANTITY);
    var result = [];

    indices.forEach(function (index) {
      result.push(data[index]);
    });

    return result;
  };

  var filterDiscussed = function (data) {
    var result = data.slice();

    result.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });

    return result;
  };

  var setFilter = function (filterName) {
    switch (filterName) {
      case 'filter-popular':
        window.gallery.render(pictures);
        break;
      case 'filter-new':
        window.gallery.render(filterNew(pictures));
        break;
      case 'filter-discussed':
        window.gallery.render(filterDiscussed(pictures));
        break;
      default:
        break;
    }
  };

  formElement.addEventListener('click', function (evt) {
    if (evt.target.tagName.toLocaleLowerCase() === 'button') {
      removeActiveClass();
      evt.target.classList.add(ACTIVE_CLASS);
      window.debounce(function () {
        setFilter(evt.target.id);
      });
    }
  });

  window.filter = {
    init: init
  };
})();
