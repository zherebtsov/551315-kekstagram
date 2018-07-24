'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var QTY_COMMENTS_ON_PAGE = 5;
  var popupElement = document.querySelector('.big-picture');
  var cancelButtonElement = popupElement.querySelector('.big-picture__cancel');
  var commentsContainerElement = popupElement.querySelector('.social__comments');
  var commentTemplateElement = popupElement.querySelector('.social__comment');
  var commentsNumberElement = popupElement.querySelector('.comments-number');
  var loadMoreButtonElement = popupElement.querySelector('.social__loadmore');
  var AvatarImageIndex = {
    FIRST: 1,
    LAST: 6
  };
  var comments = [];
  var renderedCommentsNumber;

  var renderComments = function (commentsData) {
    renderedCommentsNumber = commentsData.length;
    commentsNumberElement.textContent = renderedCommentsNumber;
    commentsContainerElement.textContent = ''; // очищаем контейнер с комментами
    commentsContainerElement.appendChild(window.utils.createElements(commentsData, commentTemplateElement, function (comment, index, element) {
      element.querySelector('.social__picture')
        .src = 'img/avatar-' + window.utils.generateRandomNumber(AvatarImageIndex.FIRST, AvatarImageIndex.LAST) + '.svg';
      element.querySelector('.social__text').textContent = comment;
      return element;
    }));

    if (comments.length === renderedCommentsNumber) {
      window.utils.hideElement(loadMoreButtonElement);
    }
  };

  var renderBigPicture = function (picture) {
    comments = picture.comments;
    popupElement.querySelector('.big-picture__img img').src = picture.url;
    popupElement.querySelector('.likes-count').textContent = picture.likes;
    popupElement.querySelector('.comments-count').textContent = picture.comments.length;
    popupElement.querySelector('.social__caption').textContent = picture.description;
    renderComments(comments.slice(0, QTY_COMMENTS_ON_PAGE));
  };

  var onBigPicturePopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPicturePopup();
    }
  };

  var onCancelBigPictureClick = function () {
    closeBigPicturePopup();
  };

  var openBigPicturePopup = function (picture) {
    renderBigPicture(picture);
    window.utils.showElement(popupElement);
    cancelButtonElement.addEventListener('click', onCancelBigPictureClick);
    document.addEventListener('keydown', onBigPicturePopupEscPress);
    loadMoreButtonElement.addEventListener('click', onLoadMoreClick);
  };

  var closeBigPicturePopup = function () {
    window.utils.hideElement(popupElement);
    cancelButtonElement.removeEventListener('click', onCancelBigPictureClick);
    document.removeEventListener('keydown', onBigPicturePopupEscPress);
    loadMoreButtonElement.removeEventListener('click', onLoadMoreClick);
    window.utils.showElement(loadMoreButtonElement);
  };

  var onLoadMoreClick = function () {
    if (comments.length > renderedCommentsNumber) {
      var newRenderedCommentsNumber = renderedCommentsNumber + QTY_COMMENTS_ON_PAGE;
      if (comments.length > newRenderedCommentsNumber) {
        renderComments(comments.slice(0, newRenderedCommentsNumber));
      } else {
        renderComments(comments);
      }
    }
  };

  window.picture = {
    openBigPicturePopup: openBigPicturePopup
  };
})();
