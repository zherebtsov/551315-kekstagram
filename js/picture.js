'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var BIG_PICTURE_POPUP = document.querySelector('.big-picture');
  var BIG_PICTURE_CANCEL = BIG_PICTURE_POPUP.querySelector('.big-picture__cancel');

  var renderBigPicture = function (picture) {
    var commentsContainer = BIG_PICTURE_POPUP.querySelector('.social__comments');
    var commentTemplate = BIG_PICTURE_POPUP.querySelector('.social__comment');
    BIG_PICTURE_POPUP.querySelector('.big-picture__img img').src = picture.url;
    BIG_PICTURE_POPUP.querySelector('.likes-count').textContent = picture.likes;
    BIG_PICTURE_POPUP.querySelector('.comments-count').textContent = picture.comments.length;
    BIG_PICTURE_POPUP.querySelector('.social__caption').textContent = picture.description;
    commentsContainer.textContent = ''; // очищаем контейнер с комментами
    commentsContainer.appendChild(window.utils.createElements(picture.comments, commentTemplate, function (comment, index, element) {
      element.querySelector('.social__picture').src = 'img/avatar-' + window.utils.generateRandomNumber(1, 6) + '.svg';
      element.querySelector('.social__text').textContent = comment;
      return element;
    }));

    // Скрываем счетчик комментариев и кнопку подгрузки
    BIG_PICTURE_POPUP.querySelector('.social__comment-count').classList.add('visually-hidden');
    BIG_PICTURE_POPUP.querySelector('.social__loadmore').classList.add('visually-hidden');
  };

  var onBigPicturePopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPicturePopup();
    }
  };

  var openBigPicturePopup = function (picture) {
    renderBigPicture(picture);
    BIG_PICTURE_POPUP.classList.remove('hidden');
    BIG_PICTURE_CANCEL.addEventListener('click', closeBigPicturePopup);
    document.addEventListener('keydown', onBigPicturePopupEscPress);
  };

  var closeBigPicturePopup = function () {
    BIG_PICTURE_POPUP.classList.add('hidden');
    BIG_PICTURE_CANCEL.removeEventListener('click', closeBigPicturePopup);
    document.removeEventListener('keydown', onBigPicturePopupEscPress);
  };

  window.picture = {
    openBigPicturePopup: openBigPicturePopup
  };
})();
