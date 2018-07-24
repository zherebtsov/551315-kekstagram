'use strict';

(function () {
  var ESC_KEYCODE = 27;
  // Popup
  var popupElement = document.querySelector('.img-upload__overlay');
  var cancelButtonElement = popupElement.querySelector('.img-upload__cancel');
  // Resize
  var resizeInputElement = popupElement.querySelector('.resize__control--value');
  var resizeMinusControlElement = popupElement.querySelector('.resize__control--minus');
  var resizePlusControlElement = popupElement.querySelector('.resize__control--plus');
  var RESIZE_STEP = 25;
  var RESIZE_MAX = 100;
  var RESIZE_MIN = 25;
  // Form
  var formElement = document.querySelector('.img-upload__form');
  var imagePreviewElement = popupElement.querySelector('.img-upload__preview img');
  var imageEffectControlsElement = popupElement.querySelector('.img-upload__effects');
  var hashtagInputElement = formElement.querySelector('.text__hashtags');
  var commentTextareaElement = formElement.querySelector('.text__description');
  var submitButtonElement = formElement.querySelector('.img-upload__submit');
  var HASHTAG_CHARACTERS_LIMIT = 20;
  var HASHTAGS_NUMBER_LIMIT = 5;
  // Scale effect
  var scalePinElement = formElement.querySelector('.scale__pin');
  var scaleControlElement = formElement.querySelector('.img-upload__scale');
  var rangeScaleInputElement = formElement.querySelector('.scale__value');
  var scaleLineElement = formElement.querySelector('.scale__line');
  var scaleLevelElement = formElement.querySelector('.scale__level');
  var EFFECT_DEFAULT = 'none';
  var DEFAULT_RANGE_SCALE_PIN = scalePinElement.style.left;
  var DEFAULT_RANGE_SCALE_VALUE = rangeScaleInputElement.value;
  var DEFAULT_RANGE_SCALE_LEVEL = scaleLevelElement.style.width;
  var isBlockedEsc = false;
  var currentEffect = '';
  var cursorStartX;
  var cursorLeftLimit;
  var cursorRightLimit;

  var setImagePreview = function (src) {
    imagePreviewElement.src = src;
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
    var currentValue = Number(resizeInputElement.value.split('%')[0]);
    var newValue = currentValue + value;

    if (newValue >= RESIZE_MIN && newValue <= RESIZE_MAX) {
      imagePreviewElement.style.transform = 'scale(' + newValue / 100 + ')';
      resizeInputElement.value = newValue + '%';
    }
  };

  var onResizeMinusClick = function () {
    resizeImagePreview(-RESIZE_STEP);
  };

  var onResizePlusClick = function () {
    resizeImagePreview(RESIZE_STEP);
  };

  var setEffectOnImagePreview = function (effect) {
    imagePreviewElement.setAttribute('class', 'effects__preview--' + effect);
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
    imagePreviewElement.removeAttribute('class'); // удаляем класс, чтобы сбросить наложенный эффект
    imagePreviewElement.style.transform = 'none'; // сбрасываем размер картинки
    formElement.reset(); // сбрасываем состояние формы
  };

  var onInputFocus = function () {
    blockEsc();
  };

  var onInputBlur = function () {
    unblockEsc();
  };

  var onCancelUploadImageClick = function () {
    closeUploadPopup();
  };

  var openUploadPopup = function () {
    window.utils.showElement(popupElement);
    cancelButtonElement.addEventListener('click', onCancelUploadImageClick);
    document.addEventListener('keydown', onUploadPopupEscPress);
    setEffectOnImagePreview(EFFECT_DEFAULT); // устанавливаем дефолтный эффект на превью
    imageEffectControlsElement.addEventListener('click', onEffectControlsClick);
    resizeMinusControlElement.addEventListener('click', onResizeMinusClick);
    resizePlusControlElement.addEventListener('click', onResizePlusClick);
    hashtagInputElement.addEventListener('focus', onInputFocus);
    hashtagInputElement.addEventListener('blur', onInputBlur);
    commentTextareaElement.addEventListener('focus', onInputFocus);
    commentTextareaElement.addEventListener('blur', onInputBlur);
  };

  var closeUploadPopup = function () {
    window.gallery.clearUploadImageInput();
    window.utils.hideElement(popupElement);
    cancelButtonElement.removeEventListener('click', onCancelUploadImageClick);
    document.removeEventListener('keydown', onUploadPopupEscPress);
    imageEffectControlsElement.removeEventListener('click', onEffectControlsClick);
    resizeMinusControlElement.removeEventListener('click', onResizeMinusClick);
    resizePlusControlElement.removeEventListener('click', onResizePlusClick);
    hashtagInputElement.removeEventListener('focus', onInputFocus);
    hashtagInputElement.removeEventListener('blur', onInputBlur);
    commentTextareaElement.removeEventListener('focus', onInputFocus);
    commentTextareaElement.removeEventListener('blur', onInputBlur);
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
      if (hashtagArray[i].split('#').length > 2) {
        return 'Хеш-тег не может содержать больше одного знака #';
      }
      if (hashtagArray[i][0] !== '#' || hashtagArray[i] === '#') {
        return 'Хеш-тег должен начинаться с #, не может состоять только из одной #';
      }
      if (hashtagArray[i].length > HASHTAG_CHARACTERS_LIMIT) {
        return 'Максимальная длина одного хэш-тега 20 символов, включая решётку';
      }
      if (hashtagArray.length > HASHTAGS_NUMBER_LIMIT) {
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
    var error = validHashtag(hashtagInputElement.value);
    hashtagInputElement.setCustomValidity(error);
    if (error) {
      addRedBorder(hashtagInputElement);
    }
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    var data = new FormData(formElement);
    window.backend.sendForm(data, onSuccess, onError);
  };

  var onSuccess = function () {
    window.toast.showMessage('Форма успешно отправлена!');
    closeUploadPopup();
  };

  var onCancelErrorClick = function () {
    closeUploadPopup();
    window.toast.hideError(onCancelErrorClick); // передаем эту же функцию для removeEventListener
  };

  var onError = function (error) {
    window.toast.showMessage('Не удалось отправить форму (' + error + ')');
    window.toast.showError(onCancelErrorClick);
  };

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

    imagePreviewElement.style.filter = styleFilter;
  };

  var initScaleEffect = function (effect) {
    rangeScaleInputElement.setAttribute('value', DEFAULT_RANGE_SCALE_VALUE);
    scalePinElement.style.left = DEFAULT_RANGE_SCALE_PIN;
    scaleLevelElement.style.width = DEFAULT_RANGE_SCALE_LEVEL;

    changeScaleEffectValue(effect, DEFAULT_RANGE_SCALE_VALUE);
  };

  var showScaleEffectControl = function (effect) {
    if (effect === EFFECT_DEFAULT) {
      window.utils.hideElement(scaleControlElement);
    } else {
      window.utils.showElement(scaleControlElement);
    }
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    if (((cursorLeftLimit !== -1) && moveEvt.clientX < cursorLeftLimit)
      || ((cursorRightLimit !== -1) && moveEvt.clientX > cursorRightLimit)) {
      return;
    }

    var cursorShiftX = cursorStartX - moveEvt.clientX;
    cursorStartX = moveEvt.clientX;

    var newValue = scalePinElement.offsetLeft - cursorShiftX;
    if (newValue < 0) {
      newValue = 0;
      cursorLeftLimit = moveEvt.clientX;
    }
    if (newValue > scaleLineElement.clientWidth) {
      newValue = scaleLineElement.clientWidth;
      cursorRightLimit = moveEvt.clientX;
    }

    var newValueProcent = Math.round(newValue / (scaleLineElement.clientWidth / 100));
    rangeScaleInputElement.setAttribute('value', String(newValueProcent));
    scalePinElement.style.left = newValue + 'px';
    scaleLevelElement.style.width = newValueProcent + '%';
    changeScaleEffectValue(currentEffect, newValueProcent);

  };

  var onMouseUp = function (evt) {
    evt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  scalePinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    cursorStartX = evt.clientX;
    cursorLeftLimit = -1;
    cursorRightLimit = -1;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  submitButtonElement.addEventListener('click', onSubmitClick);
  formElement.addEventListener('submit', onFormSubmit);
  hashtagInputElement.addEventListener('input', function () {
    delRedBorder(hashtagInputElement);
    hashtagInputElement.setCustomValidity('');
  });

  window.form = {
    openUploadPopup: openUploadPopup,
    setImagePreview: setImagePreview
  };
})();
