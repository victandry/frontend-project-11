import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import watch from './view.js';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';

export default () => {
  const elements = {
    // fields: {},
    form: document.querySelector('.rss-form'),
    rssInput: document.querySelector('#rssInput'),
    rssOutput: document.querySelector('#rssOutput'),
    // errorFields: {},
  };

  const defaultLang = 'ru';

  const state = {
    rssForm: {
      status: null,
      valid: false,
      errors: [],
    },
    feeds: [],
    feedItems: [],
  };

  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.invalidURL' }),
    },
    mixed: {
      required: () => ({ key: 'errors.required' }),
      notOneOf: () => ({ key: 'errors.rssExists' }),
    },
  });

  const i18n = i18next.createInstance();
  i18n.init({
    debug: false,
    lng: defaultLang,
    resources,
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    t('key'); // -> same as i18next.t
  });

  const watchedState = watch(elements, i18n, state);
  watchedState.rssForm.status = 'filling';

  const createSchema = (feeds) => {
    let schema = yup.object().shape({
      url: yup.string()
      .required()
      .url()
      .notOneOf(feeds.map(({ url }) => url))
    });
    return schema;
  };

  const formFeed = (data, url) => {
    const feedChannel = data.querySelectorAll("channel");
    const newFeed = {};
    newFeed.url = url;
    newFeed.id = uniqueId();
    console.log('feedId', newFeed.id);
    newFeed.title = feedChannel[0].querySelector("title").textContent;
    newFeed.description = feedChannel[0].querySelector("description").textContent;
    newFeed.link = feedChannel[0].querySelector("link").textContent;
    watchedState.feeds.push(newFeed);
    return newFeed.id;
  };

  const formFeedItems = (data, feedId) => {
    const items = data.querySelectorAll("item");
    const newItemEntries = [];
    items.forEach((item) => {
      const itemEntry = {};
      itemEntry.id = item.querySelector("guid").textContent;
      itemEntry.feedId = feedId;
      itemEntry.title = item.querySelector("title").textContent;
      itemEntry.link = item.querySelector("link").textContent;
      itemEntry.description = item.querySelector("description").textContent;
      newItemEntries.push(itemEntry);
    });
    watchedState.feedItems = [...state.feedItems, ...newItemEntries];
  }

  const updateFeeds = (url) => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((response) => { 
      console.log('response', response);
      return { contents: response.data.contents, url };
    })
    .then(({ contents, url }) => [new window.DOMParser().parseFromString(contents, "text/xml"), url])
    .then(([data, url]) => {
      const feedsNewItems = data.querySelectorAll("item"); // новые посты
      const feedId = state.feeds // найдём id фида
        .filter((feed) => feed.url === url)
        .map((feed) => feed.id);
      const feedsOldItems = state.feedItems // вычленим из всех постов посты с id фида
        .filter((feedItem) => feedItem.feedId === feedId);
      if (feedsNewItems.length > feedsOldItems.length) { // если количество новых постов по фиду больше старых (значит появились новые посты и их надо отобразить)
        const feedOldItemsIds = feedsOldItems // найдём id старых постов
          .map(({ id }) => id);
        const updatedItems = [];
        feedsNewItems.forEach((item) => {
          const itemEntry = {};
          itemEntry.id = item.querySelector("guid").textContent;
          itemEntry.feedId = feedId;
          itemEntry.title = item.querySelector("title").textContent;
          itemEntry.link = item.querySelector("link").textContent;
          itemEntry.description = item.querySelector("description").textContent;
          updatedItems.push(itemEntry);
        });
        const newItems = updatedItems.filter((item) => feedOldItemsIds.indexOf(item.id) === -1); // нашли новые посты
        watchedState.feedItems = [...state.feedItems, ...newItems]; // обновили состояние новыми постами, чтобы отрендерить обновлённый список
      }
      return url;
    })
    .then((url) => setTimeout(() => updateFeeds(url), 5000));
  }

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRss = Object.fromEntries(formData);

    createSchema(state.feeds)
      .validate(newRss, { abortEarly: false })
      .then(function(value) {
        console.log('state.feeds', state.feeds, 'value.url', value.url);
        watchedState.rssForm.errors = [];
        const { url } = value;
        watchedState.rssForm.valid = true;
        watchedState.rssForm.valid = '';
        return url;
      })
      .then(url => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`))
      .then(response => { 
        console.log (response);
        return {contents: response.data.contents, url: response.data.status.url};
      })
      .then(({ contents, url }) => [new window.DOMParser().parseFromString(contents, "text/xml"), url])
      .then(([data, url]) => {
        const feedId = formFeed(data, url);
        formFeedItems(data, feedId);
        return url;
      })
      .then((url) => setTimeout(() => updateFeeds(url), 5000))
      .catch((err) => {
        // console.log(`An error [${err.inner.map(({message}) => message.key)}] has occured, figure it out!`);
        console.log(`An error ${err} has occured, figure it out!`);
        const validationErrors = err.inner.reduce((acc, cur) => {
          const { message } = cur;
          return [...acc, message.key];
        }, []);
        watchedState.rssForm.errors = validationErrors;
        //watchedState.rssForm.valid = false;
      });
  });
};
