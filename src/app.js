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
  
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRss = Object.fromEntries(formData);

    createSchema(state.feeds)
      .validate(newRss, { abortEarly: false })
      .then(function(value) {
        console.log('state.feeds', state.feeds, 'value.url', value.url);
        watchedState.rssForm.errors = [];
        // const { url } = value;
        state.feeds.push(value);
        watchedState.rssForm.valid = true;
        watchedState.rssForm.valid = '';
      })
      .catch((err) => {
        // console.log(`An error [${err.inner.map(({message}) => message.key)}] has occured, figure it out!`);
        const validationErrors = err.inner.reduce((acc, cur) => {
          const { path, message } = cur;
          return [...acc, message.key];
        }, []);
        watchedState.rssForm.errors = validationErrors;
        //watchedState.rssForm.valid = false;
      });
  });
};
