'use strict';

(function () {
  var uploadImageInputElement = document.querySelector('.img-upload__input');
  var pictureTemplateElement = document.querySelector('template').content;
  var picturesContainerElement = document.querySelector('.pictures');

  var renderPictures = function (pictures) {
    removePictures();
    picturesContainerElement.appendChild(window.utils.createElements(pictures, pictureTemplateElement, function (picture, index, element) {
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
    var pictureElements = picturesContainerElement.querySelectorAll('.picture__link');
    pictureElements.forEach(function (element) {
      picturesContainerElement.removeChild(element);
    });
  };

  var clearUploadImageInput = function () {
    uploadImageInputElement.value = '';
  };

  var onError = function (error) {
    window.toast.showMessage('Не удалось загрузить картинки (' + error + ')');
  };

  var onPicturesLoad = function (pictures) {
    renderPictures(pictures);
    window.filter.init(pictures);
  };

  var onUploadImageChange = function () {
    var file = uploadImageInputElement.files[0];
    var fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      window.form.setImagePreview(fileReader.result);
      window.form.openUploadPopup();
    };
    fileReader.onerror = function (error) {
      window.toast.showMessage('Error: ', error);
    };
  };

  window.backend.loadPictures(onPicturesLoad, onError);
  uploadImageInputElement.addEventListener('change', onUploadImageChange);

  window.gallery = {
    render: renderPictures,
    clearUploadImageInput: clearUploadImageInput
  };

})();
