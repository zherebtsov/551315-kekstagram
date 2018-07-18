'use strict';

(function () {
  var UPLOAD_IMAGE_INPUT = document.querySelector('.img-upload__input');
  var PICTURE_TEMPLATE = document.querySelector('template').content;

  var renderPictures = function (pictures) {
    var container = document.querySelector('.pictures');
    container.appendChild(window.utils.createElements(pictures, PICTURE_TEMPLATE, function (picture, index, element) {
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

  var pictures = window.data.generatePictures();
  renderPictures(pictures);
  UPLOAD_IMAGE_INPUT.addEventListener('change', window.form.openUploadPopup);

})();
