import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import watch from './view.js';

export default () => { // убрать async сделать промисы
  const elements = {
    // fields: {},
    rssInput: document.querySelector('#rssInput'),
    rssOutput: document.querySelector('#rssOutput'),
    // errorFields: {},
  };

  const defaultLang = 'ru';

  const state = {
    form: {
      status: null,
      valid: false,
      errors: [],
    },
  };

  watch(elements);
  //watchedState.form.status = 'filling';

  /* const i18n = i18next.createInstance();
  await i18n.init({ // убрать await сделать промисы
    debug: false,
    lng: defaultLang,
    resources,
  }); */

  const schema = yup.object().shape({
    rsslink: yup.string()
    .required('Обязательное поле!') // замена на i18n.t(...)
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Введите корректный сайт!' // замена на i18n.t(...)
    ),
  });

  const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return keyBy(e.inner, 'path');
    }
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRss = Object.fromEntries(formData);

    /* try {
      schema.validateSync(newRss, { abortEarly: false });
      watchedState.form.errors = [];
      watchedState.form.valid = true;

    } catch (err) {
      const validationErrors = err.inner.reduce((acc, cur) => {
        const { path, message } = cur;
        return {...acc, [path]: [...acc[path] || [], message]};
      }, {});
      watchedState.form.errors = validationErrors;
    }; */

    
  });
};

/* <main class="flex-grow-1">
      <section class="container-fluid bg-dark p-5">
          <div class="row">
              <div class="col-md-10 col-lg-8 mx-auto text-white">
                  <h1 class="display-3 mb-0">RSS агрегатор</h1>
                  <p class="lead">Начните читать RSS сегодня! Это легко, это красиво.</p>
                  <form action="" class="rss-form text-body">
                      <div class="row">
                          <div class="col">
                              <div class="form-floating">
                                  <input id="url-input" autofocus required name="url" aria-label="url" class="form-control w-100" placeholder="ссылка RSS" autocomplete="off">
                                  <label for="url-input">Ссылка RSS</label>
                              </div>
                          </div>
                          <div class="col-auto">
                              <button type="submit" aria-label="add" class="h-100 btn btn-lg btn-primary px-sm-5">Добавить</button>
                          </div>
                      </div>
                  </form>
                  <p class="mt-2 mb-0 text-muted">Пример: https://ru.hexlet.io/lessons.rss</p>
                  <p class="feedback m-0 position-absolute small text-danger"></p>
              </div>
          </div>
      </section>
      <section class="container-fluid container-xxl p-5">
          <div class="row">
              <div class="col-md-10 col-lg-8 order-1 mx-auto posts"></div>
              <div class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds"></div>
          </div>
      </section>
    </main> */
