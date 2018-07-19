'use strict';

(function () {
  var Url = {
    LOAD_PICTURES: 'https://js.dump.academy/kekstagram/data',
    SEND_FORM: 'https://js.dump.academy/kekstagram'
  };
  var XHR_TIMEOUT = 10000; // 10c
  var SUCCESS_CODE = 200;

  var request = function (method, url, onLoad, onError, data, onStartRequest, onEndRequest) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {

      if (onEndRequest) {
        onEndRequest();
      }

      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка, статус ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Ошибка, превышено время ожидания ответа (' + xhr.timeout + ' мс)');
    });

    xhr.timeout = XHR_TIMEOUT;

    xhr.open(method, url);

    if (method === 'POST') {
      xhr.send(data);
    } else {
      xhr.send();
    }

    if (onStartRequest) {
      onStartRequest();
    }
  };

  var loadPictures = function (onLoad, onError) {
    request('GET', Url.LOAD_PICTURES, onLoad, onError, null, window.toast.showPreloader, window.toast.hidePreloader);
  };

  var sendForm = function (data, onLoad, onError) {
    request('POST', Url.SEND_FORM, onLoad, onError, data, function () {
      window.toast.show('Отправка...');
    }, window.toast.hide);
  };

  window.backend = {
    loadPictures: loadPictures,
    sendForm: sendForm
  };
})();
