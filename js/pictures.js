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
var UPLOAD_IMAGE_SUBMIT_BUTTON = UPLOAD_IMAGE_FORM.querySelector('.img-upload__submit');
var isBlockedEsc = false;
var EFFECT_ORIGION = 'none';

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

var setEffectOnImagePreview = function (effect) {
  UPLOAD_IMAGE_PREVIEW.setAttribute('class', 'effects__preview--' + effect);
  initScaleEffect(effect);
  showScaleEffectControl(effect);
  currentEffect = effect;
};

var onEffectControlsClick = function (evt) {
  if (evt.target.tagName.toLocaleLowerCase() === 'input' && evt.target.value) {
    setEffectOnImagePreview(evt.target.value);
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
  setEffectOnImagePreview(EFFECT_ORIGION); // устанавливаем дефолтный эффект на превью
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

var onSubmitClick = function () {
  var error = validHashtag(UPLOAD_IMAGE_HASHTAG_INPUT.value);
  UPLOAD_IMAGE_HASHTAG_INPUT.setCustomValidity(error);
  if (error !== '') {
    addRedBorder(UPLOAD_IMAGE_HASHTAG_INPUT);
  }
};

var pictures = generatePictures(PICTURES_NUM);
renderPictures(pictures);
UPLOAD_IMAGE_INPUT.addEventListener('change', openUploadPopup);
UPLOAD_IMAGE_SUBMIT_BUTTON.addEventListener('click', onSubmitClick);
UPLOAD_IMAGE_HASHTAG_INPUT.addEventListener('input', function () {
  delRedBorder(UPLOAD_IMAGE_HASHTAG_INPUT);
  UPLOAD_IMAGE_HASHTAG_INPUT.setCustomValidity('');
});

var SCALE_PIN = UPLOAD_IMAGE_FORM.querySelector('.scale__pin');
var SCALE_CONTROL = UPLOAD_IMAGE_FORM.querySelector('.img-upload__scale');
var RANGE_SCALE_INPUT = UPLOAD_IMAGE_FORM.querySelector('.scale__value');
var SCALE_LINE = UPLOAD_IMAGE_FORM.querySelector('.scale__line');
var SCALE_LEVEL = UPLOAD_IMAGE_FORM.querySelector('.scale__level');
var DEFAULT_RANGE_SCALE_PIN = SCALE_PIN.style.left;
var DEFAULT_RANGE_SCALE_VALUE = RANGE_SCALE_INPUT.value;
var DEFAULT_RANGE_SCALE_LEVEL = SCALE_LEVEL.style.width;
var currentEffect = '';
var cursorStartX;
var cursorLeftLimit;
var cursorRightLimit;

var changeScaleEffectValue = function (effect, value) {
  var styleFilter;

  switch (effect) {
    case 'chrome':
      styleFilter = 'grayscale(' + value / 100 + ')'; // 0..1
      break;
    case 'sepia':
      styleFilter = 'sepia(' + value / 100 + ')'; // 0..1
      break;
    case 'marvin':
      styleFilter = 'invert(' + value + '%)'; // 0..100%
      break;
    case 'phobos':
      styleFilter = 'blur(' + value / 33.33 + 'px)'; // 0..3px
      break;
    case 'heat':
      styleFilter = 'brightness(' + value / 33.33 + ')'; // 0..3
      break;
    default:
      styleFilter = '';
  }

  UPLOAD_IMAGE_PREVIEW.style.filter = styleFilter;
};

var initScaleEffect = function (effect) {
  RANGE_SCALE_INPUT.setAttribute('value', DEFAULT_RANGE_SCALE_VALUE);
  SCALE_PIN.style.left = DEFAULT_RANGE_SCALE_PIN;
  SCALE_LEVEL.style.width = DEFAULT_RANGE_SCALE_LEVEL;

  changeScaleEffectValue(effect, DEFAULT_RANGE_SCALE_VALUE);
};

var showScaleEffectControl = function (effect) {
  if (effect === EFFECT_ORIGION) {
    SCALE_CONTROL.classList.add('hidden');
  } else {
    SCALE_CONTROL.classList.remove('hidden');
  }
};

SCALE_PIN.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  cursorStartX = evt.clientX;
  cursorLeftLimit = -1;
  cursorRightLimit = -1;

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

var onMouseMove = function (moveEvt) {
  moveEvt.preventDefault();

  if (((cursorLeftLimit !== -1) && moveEvt.clientX < cursorLeftLimit)
    || ((cursorRightLimit !== -1) && moveEvt.clientX > cursorRightLimit)) {
    return;
  }

  var cursorShiftX = cursorStartX - moveEvt.clientX;
  cursorStartX = moveEvt.clientX;

  var newValue = SCALE_PIN.offsetLeft - cursorShiftX;
  if (newValue < 0) {
    newValue = 0;
    cursorLeftLimit = moveEvt.clientX;
  }
  if (newValue > SCALE_LINE.clientWidth) {
    newValue = SCALE_LINE.clientWidth;
    cursorRightLimit = moveEvt.clientX;
  }

  var newValueProcent = Math.round(newValue / (SCALE_LINE.clientWidth / 100));
  RANGE_SCALE_INPUT.setAttribute('value', String(newValueProcent));
  SCALE_PIN.style.left = newValue + 'px';
  SCALE_LEVEL.style.width = newValueProcent + '%';
  changeScaleEffectValue(currentEffect, newValueProcent);

};

var onMouseUp = function (evt) {
  evt.preventDefault();
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};
