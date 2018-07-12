'use strict';

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
var BIG_PICTURE_ELEMENT = document.querySelector('.big-picture');

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
      comments: [COMMENTS[generateRandomNumber(0, (COMMENTS.length - 1))], COMMENTS[generateRandomNumber(0, (COMMENTS.length - 1))]],
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
    return element;
  }));
};

var renderBigPicture = function (picture) {
  var commentsContainer = BIG_PICTURE_ELEMENT.querySelector('.social__comments');
  var commentTemplate = BIG_PICTURE_ELEMENT.querySelector('.social__comment');
  BIG_PICTURE_ELEMENT.querySelector('.big-picture__img img').src = picture.url;
  BIG_PICTURE_ELEMENT.querySelector('.likes-count').textContent = picture.likes;
  BIG_PICTURE_ELEMENT.querySelector('.comments-count').textContent = picture.comments.length;
  BIG_PICTURE_ELEMENT.querySelector('.social__caption').textContent = picture.description;
  commentsContainer.textContent = ''; // очищаем контейнер с комментами
  commentsContainer.appendChild(createElements(picture.comments, commentTemplate, function (comment, index, element) {
    element.querySelector('.social__picture').src = 'img/avatar-' + generateRandomNumber(1, 6) + '.svg';
    element.querySelector('.social__text').textContent = comment;
    return element;
  }));
};

var pictures = generatePictures(PICTURES_NUM);
renderPictures(pictures);
BIG_PICTURE_ELEMENT.classList.remove('hidden');
renderBigPicture(pictures[0]);
BIG_PICTURE_ELEMENT.querySelector('.social__comment-count').classList.add('visually-hidden');
BIG_PICTURE_ELEMENT.querySelector('.social__loadmore').classList.add('visually-hidden');
