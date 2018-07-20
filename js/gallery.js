'use strict';

(function () {
  var UPLOAD_IMAGE_INPUT = document.querySelector('.img-upload__input');
  var PICTURE_TEMPLATE = document.querySelector('template').content;
  var PICTURES_CONTAINER = document.querySelector('.pictures');

  var renderPictures = function (pictures) {
    removePictures();
    PICTURES_CONTAINER.appendChild(window.utils.createElements(pictures, PICTURE_TEMPLATE, function (picture, index, element) {
      element.querySelector('.picture__img').src = picture.url;
      element.querySelector('.picture__stat--likes').textContent = picture.likes;
      element.querySelector('.picture__stat--comments').textContent = picture.comments.length;
      element.querySelector('.picture__link').addEventListener('click', function (evt) {
        evt.preventDefault();
        window.picture.openBigPicturePopup(picture);
      });
      return element;
    }));
  };

  var removePictures = function () {
    var elements = PICTURES_CONTAINER.querySelectorAll('.picture__link');
    elements.forEach(function (element) {
      PICTURES_CONTAINER.removeChild(element);
    });
  };

  var onError = function (error) {
    window.toast.showMessage('Не удалось загрузить картинки (' + error + ')');
  };

  var onPicturesLoad = function (pictures) {
    renderPictures(pictures);
    window.filter.init(pictures);
  };

  window.backend.loadPictures(onPicturesLoad, onError);
  UPLOAD_IMAGE_INPUT.addEventListener('change', window.form.openUploadPopup);

  window.gallery = {
    render: renderPictures
  };

})();
