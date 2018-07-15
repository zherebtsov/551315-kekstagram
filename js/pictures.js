'use strict';

var ESC_KEYCODE = 27;
var PICTURES_NUM = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
var PICTURE_TEMPLATE = document.querySelector('template').content;

var BIG_PICTURE_POPUP = document.querySelector('.big-picture');
var BIG_PICTURE_CANCEL = BIG_PICTURE_POPUP.querySelector('.big-picture__cancel');

var UPLOAD_IMAGE_INPUT = document.querySelector('.img-upload__input');
var UPLOAD_IMAGE_POPUP = document.querySelector('.img-upload__overlay');
var UPLOAD_IMAGE_CANCEL = UPLOAD_IMAGE_POPUP.querySelector('.img-upload__cancel');
var UPLOAD_IMAGE_EFFECT_CONTROLS = UPLOAD_IMAGE_POPUP.querySelector('.img-upload__effects');
var UPLOAD_IMAGE_RESIZE_VALUE = UPLOAD_IMAGE_POPUP.querySelector('.resize__control--value');
var UPLOAD_IMAGE_RESIZE_CONTROL_MINUS = UPLOAD_IMAGE_POPUP.querySelector('.resize__control--minus');
var UPLOAD_IMAGE_RESIZE_CONTROL_PLUS = UPLOAD_IMAGE_POPUP.querySelector('.resize__control--plus');
var RESIZE_STEP = 25;
var RESIZE_MAX = 100;
var RESIZE_MIN = 25;
var UPLOAD_IMAGE_PREVIEW = UPLOAD_IMAGE_POPUP.querySelector('.img-upload__preview img');
var UPLOAD_IMAGE_FORM = document.querySelector('.img-upload__form');
var UPLOAD_IMAGE_HASHTAG_INPUT = UPLOAD_IMAGE_FORM.querySelector('.text__hashtags');
var UPLOAD_IMAGE_COMMENT_TEXTAREA = UPLOAD_IMAGE_FORM.querySelector('.text__description');
var isBlockedEsc = false;

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

var generatePictures = function (num) {
  var pictures = [];
  for (var i = 0; i < num; i++) {
    pictures[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: generateRandomNumber(LIKES_MIN, LIKES_MAX),
      comments: [
        COMMENTS[generateRandomNumber(0, (COMMENTS.length - 1))],
        COMMENTS[generateRandomNumber(0, (COMMENTS.length - 1))]
      ],
      description: DESCRIPTION[generateRandomNumber(0, (DESCRIPTION.length - 1))]
    };
  }
  return pictures;
};

var renderPictures = function (pictures) {
  var container = document.querySelector('.pictures');
  container.appendChild(createElements(pictures, PICTURE_TEMPLATE, function (picture, index, element) {
    element.querySelector('.picture__img').src = picture.url;
    element.querySelector('.picture__stat--likes').textContent = picture.likes;
    element.querySelector('.picture__stat--comments').textContent = picture.comments.length;
    element.querySelector('.picture__link').addEventListener('click', function (evt) {
      evt.preventDefault();
      openBigPicturePopup(picture);
    });
    return element;
  }));
};

var renderBigPicture = function (picture) {
  var commentsContainer = BIG_PICTURE_POPUP.querySelector('.social__comments');
  var commentTemplate = BIG_PICTURE_POPUP.querySelector('.social__comment');
  BIG_PICTURE_POPUP.querySelector('.big-picture__img img').src = picture.url;
  BIG_PICTURE_POPUP.querySelector('.likes-count').textContent = picture.likes;
  BIG_PICTURE_POPUP.querySelector('.comments-count').textContent = picture.comments.length;
  BIG_PICTURE_POPUP.querySelector('.social__caption').textContent = picture.description;
  commentsContainer.textContent = ''; // очищаем контейнер с комментами
  commentsContainer.appendChild(createElements(picture.comments, commentTemplate, function (comment, index, element) {
    element.querySelector('.social__picture').src = 'img/avatar-' + generateRandomNumber(1, 6) + '.svg';
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

var blockEsc = function () {
  isBlockedEsc = true;
};

var unblockEsc = function () {
  isBlockedEsc = false;
};

var onUploadPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && !isBlockedEsc) {
    closeUploadPopup();
  }
};

var resizeImagePreview = function (value) {
  var currentValue = Number(UPLOAD_IMAGE_RESIZE_VALUE.value.split('%')[0]);
  var newValue = currentValue + value;

  if (newValue >= RESIZE_MIN && newValue <= RESIZE_MAX) {
    UPLOAD_IMAGE_PREVIEW.style.transform = 'scale(' + newValue / 100 + ')';
    UPLOAD_IMAGE_RESIZE_VALUE.value = newValue + '%';
  }
};

var onResizeMinusClick = function () {
  resizeImagePreview(-RESIZE_STEP);
};

var onResizePlusClick = function () {
  resizeImagePreview(RESIZE_STEP);
};

var onEffectControlsClick = function (evt) {
  if (evt.target.tagName.toLocaleLowerCase() === 'input' && evt.target.value) {
    UPLOAD_IMAGE_PREVIEW.setAttribute('class', 'effects__preview--' + evt.target.value);
  }
};

var resetUploadPopup = function () {
  UPLOAD_IMAGE_PREVIEW.removeAttribute('class'); // удаляем класс, чтобы сбросить наложенный эффект
  UPLOAD_IMAGE_PREVIEW.style.transform = 'none'; // сбрасываем размер картинки
  UPLOAD_IMAGE_FORM.reset(); // сбрасываем состояние формы
};

var openUploadPopup = function () {
  UPLOAD_IMAGE_POPUP.classList.remove('hidden');
  UPLOAD_IMAGE_CANCEL.addEventListener('click', closeUploadPopup);
  document.addEventListener('keydown', onUploadPopupEscPress);
  UPLOAD_IMAGE_EFFECT_CONTROLS.addEventListener('click', onEffectControlsClick);
  UPLOAD_IMAGE_RESIZE_CONTROL_MINUS.addEventListener('click', onResizeMinusClick);
  UPLOAD_IMAGE_RESIZE_CONTROL_PLUS.addEventListener('click', onResizePlusClick);
  UPLOAD_IMAGE_HASHTAG_INPUT.addEventListener('focus', blockEsc);
  UPLOAD_IMAGE_HASHTAG_INPUT.addEventListener('blur', unblockEsc);
  UPLOAD_IMAGE_COMMENT_TEXTAREA.addEventListener('focus', blockEsc);
  UPLOAD_IMAGE_COMMENT_TEXTAREA.addEventListener('blur', unblockEsc);
};

var closeUploadPopup = function () {
  UPLOAD_IMAGE_INPUT.value = ''; // очищаем инпут
  UPLOAD_IMAGE_POPUP.classList.add('hidden');
  UPLOAD_IMAGE_CANCEL.removeEventListener('click', closeUploadPopup);
  document.removeEventListener('keydown', onUploadPopupEscPress);
  UPLOAD_IMAGE_EFFECT_CONTROLS.removeEventListener('click', onEffectControlsClick);
  UPLOAD_IMAGE_RESIZE_CONTROL_MINUS.removeEventListener('click', onResizeMinusClick);
  UPLOAD_IMAGE_RESIZE_CONTROL_PLUS.removeEventListener('click', onResizePlusClick);
  UPLOAD_IMAGE_HASHTAG_INPUT.removeEventListener('focus', blockEsc);
  UPLOAD_IMAGE_HASHTAG_INPUT.removeEventListener('blur', unblockEsc);
  UPLOAD_IMAGE_COMMENT_TEXTAREA.removeEventListener('focus', blockEsc);
  UPLOAD_IMAGE_COMMENT_TEXTAREA.removeEventListener('blur', unblockEsc);
  resetUploadPopup();
};

var addRedBorder = function (element) {
  element.style.border = '2px solid red';
};

var delRedBorder = function (element) {
  element.style.border = '';
};

function validHashtag(value) {

  if (value === '') {
    return '';
  }

  var hashtagArray = value.split(' ');

  for (var i = 0; i < hashtagArray.length; i++) {
    if (hashtagArray[i][0] !== '#' || hashtagArray[i][0] === '#') {
      return 'Хеш-тег должен начинаться с #, не может состоять только из одной #';
    }
    if (hashtagArray[i].length > 20) {
      return 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
    }
    if (hashtagArray.length > 5) {
      return 'Нельзя указать больше пяти хэш-тегов';
    }
    for (var j = i + 1; j < hashtagArray.length; j++) {
      if (hashtagArray[i].toLowerCase() === hashtagArray[j].toLowerCase()) {
        return 'Хэш-теги не должны повторяться';
      }
    }
  }
  return '';
}

var onUploadFormSubmit = function (evt) {
  var error = validHashtag(UPLOAD_IMAGE_HASHTAG_INPUT.value);
  UPLOAD_IMAGE_HASHTAG_INPUT.setCustomValidity(error);
  if (error !== '') {
    evt.preventDefault();
    addRedBorder(UPLOAD_IMAGE_HASHTAG_INPUT);
  }
};

var pictures = generatePictures(PICTURES_NUM);
renderPictures(pictures);
UPLOAD_IMAGE_INPUT.addEventListener('change', openUploadPopup);
UPLOAD_IMAGE_FORM.addEventListener('submit', onUploadFormSubmit);
UPLOAD_IMAGE_HASHTAG_INPUT.addEventListener('click', function () {
  delRedBorder(UPLOAD_IMAGE_HASHTAG_INPUT);
  UPLOAD_IMAGE_HASHTAG_INPUT.setCustomValidity('');
});
