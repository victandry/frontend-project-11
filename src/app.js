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
    rssForm: {
      status: null,
      valid: false,
      errors: [],
    },
    feeds: [],
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
  watchedState.rssForm.status = 'filling';

  const schema = yup.object().shape({
    url: yup.string()
    .required(i18n.t('errors.requiredField'))
    .url(i18n.t('errors.invalidURL'))
    .notOneOf(state.feeds.map(({ url }) => url), i18n.t('errors.rssExists')),
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRss = Object.fromEntries(formData);

    schema
      .validate(newRss, { abortEarly: false })
      .then(function(value) {
        watchedState.rssForm.errors = [];
        watchedState.feeds.push(value);
        watchedState.rssForm.valid = true;
        watchedState.rssForm.valid = '';
        console.log(value);
      })
      .catch(function (err) {
        const validationErrors = err.inner.reduce((acc, cur) => {
          const { path, message } = cur;
          return path;
        }, []);
        watchedState.rssForm.errors = validationErrors;
        watchedState.rssForm.valid = false;
      });
  });
};
