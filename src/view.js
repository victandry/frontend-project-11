import onChange from 'on-change';

export default (elements, i18n, state) => {
  const renderForm = () => {
    const rssHeading = elements.rssInput.querySelector('h1');
    rssHeading.textContent = i18n.t('heading'); // замена на i18n.t(...)

    const rssPEl = elements.rssInput.querySelector('.lead');
    rssPEl.textContent = i18n.t('subHeading'); // замена на i18n.t(...)

    const urlInput = elements.rssInput.querySelector('#url-input');
    urlInput.setAttribute('placeholder', i18n.t('inputRssFieldName')); // замена на i18n.t(...)

    const labelUrlInput = urlInput.nextElementSibling;
    labelUrlInput.textContent = i18n.t('inputRssFieldName'); // замена на i18n.t(...)

    const submitButton = elements.form.querySelector('button');
    submitButton.textContent = i18n.t('submitButton'); // замена на i18n.t(...)

    const exampleEl = elements.form.nextElementSibling;
    exampleEl.textContent = i18n.t('example'); // замена на i18n.t(...)
  };

  const handleErrors = () => {
    const errEl = document.createElement('p');
    errEl.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    errEl.textContent = state.form.errors;
    if (errEl.textContent) {
      const divTextWhite = elements.form.parentElement;
      divTextWhite.append(errEl);

      const formInput = document.querySelector('#url-input');
      formInput.classList.add('is-invalid');
    }

    /* const formFields = Object.keys(fields);
    formFields.forEach((item) => {
      if (!state.form.errors[item]) {
        fields[item].classList.remove('is-invalid');
        fields[item].classList.add('is-valid');
      } else {
        fields[item].classList.add('is-invalid');
        fields[item].classList.remove('is-valid');
        const itemErrors = state.form.errors[item];
        itemErrors.forEach((error) => {
          errorFields[item].textContent = i18n.t(error.key, error.values);
        });
      }
    }); */
  }

  const clearMessage = () => {
    const messageEl = document.querySelector('.text-danger') ?? document.querySelector('.text-success');
    if (messageEl) {
      if (messageEl.parentNode) {
        messageEl.parentElement.removeChild(messageEl);
      }
    }

    const formInput = document.querySelector('#url-input');
    formInput.classList.remove('is-invalid');
  }

  const displaySuccessMessage = () => {
    const successEl = document.createElement('p');
    successEl.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-success');
    successEl.textContent = i18n.t('successMessage');

    const divTextWhite = elements.form.parentElement;
    divTextWhite.append(successEl);
    elements.form.reset();

    const rssInput = document.getElementById('url-input');
    rssInput.focus();
  }

  const watchedState = onChange(state, (path) => {
    switch(path) {
      case 'rssForm.status':
        renderForm();
        // getFormElements();
        break;
      case 'rssForm.errors':
        clearMessage();
        handleErrors();
        break;
      case 'rssForm.valid':
        if (state.rssForm.valid === true) {
          clearMessage();
          displaySuccessMessage();
        }
        break; 
      default:
       break;
    } 
  });

  return watchedState;
};
