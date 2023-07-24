import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import watch from './view.js';

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
    form: {
      status: null,
      valid: false,
      addedRssFeeds: [],
      addedRssPosts: [],
      errors: [],
    },
  };

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
  watchedState.form.status = 'filling';

  const schema = yup.object().shape({
    url: yup.string()
    .required(i18n.t('errors.requiredField'))
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      i18n.t('errors.invalidURL')
    )
    .notOneOf([...Object.values(watchedState.form.addedRssFeeds)], i18n.t('errors.rssExists')),
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRss = Object.fromEntries(formData);

    schema
      .validate(newRss, { abortEarly: false })
      .then(function(value) {
        console.log(Object.values(watchedState.form.addedRssFeeds));
        console.log(value.url);
        watchedState.form.errors = [];
        watchedState.form.addedRssFeeds.push(value.url);
        watchedState.form.valid = true;
        watchedState.form.valid = '';
        console.log(value);
      })
      .catch(function (err) {
        const validationErrors = err.inner.reduce((acc, cur) => {
          const { path, message } = cur;
          console.log('yoohoo', path, message);
          return message;
        }, {});
        watchedState.form.errors = validationErrors;
        watchedState.form.valid = false;
      });
  });
};
