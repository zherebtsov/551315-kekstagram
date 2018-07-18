'use strict';

(function () {
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

  var generatePictures = function () {
    var pictures = [];
    for (var i = 0; i < PICTURES_NUM; i++) {
      pictures[i] = {
        url: 'photos/' + (i + 1) + '.jpg',
        likes: window.utils.generateRandomNumber(LIKES_MIN, LIKES_MAX),
        comments: [
          COMMENTS[window.utils.generateRandomNumber(0, (COMMENTS.length - 1))],
          COMMENTS[window.utils.generateRandomNumber(0, (COMMENTS.length - 1))]
        ],
        description: DESCRIPTION[window.utils.generateRandomNumber(0, (DESCRIPTION.length - 1))]
      };
    }
    return pictures;
  };

  window.data = {
    generatePictures: generatePictures
  };
})();
