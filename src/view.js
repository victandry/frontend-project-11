import onChange from 'on-change';

export default (elements) => {
  const renderForm = () => {
    const rssHeading = document.createElement('h1');
    rssHeading.classList.add('display-3', 'mb-0');
    rssHeading.textContent = 'RSS агрегатор'; // замена на i18n.t(...)

    const rssPEl = document.createElement('p');
    rssPEl.classList.add('lead');
    rssPEl.textContent = 'Начните читать RSS сегодня! Это легко, это красиво.'; // замена на i18n.t(...)

    const form = document.createElement('form');
    form.classList.add('rss-form', 'text-body');

    const formDivElRow = document.createElement('div');
    formDivElRow.classList.add('row');

    const formDivElCol = document.createElement('div');
    formDivElCol.classList.add('col');

    const formDivElFloat = document.createElement('div');
    formDivElFloat.classList.add('form-floating');

    const inputField = document.createElement('input');
    inputField.classList.add('form-control', 'w-100');
    inputField.id = 'url-input';
    inputField.name = 'url';
    inputField.setAttribute('aria-label', 'url');
    inputField.setAttribute('placeholder', 'ссылка RSS'); // замена на i18n.t(...)
    inputField.setAttribute('autocomplete', 'off');
    inputField.setAttribute('autofocus', '');
    inputField.setAttribute('required', '');

    const inputLabel = document.createElement('label');
    inputLabel.for = 'url-input';
    inputLabel.textContent = 'Ссылка URL'; // замена на i18n.t(...)

    formDivElFloat.append(inputField);
    formDivElFloat.append(inputLabel);
    formDivElCol.append(formDivElFloat);

    const submitButtonDiv = document.createElement('div');
    submitButtonDiv.classList.add('col-auto');

    const submitButton = document.createElement('button');
    submitButton.classList.add('h-100', 'btn', 'btn-lg', 'btn-primary', 'px-sm-5');
    submitButton.type = 'submit';
    submitButton.setAttribute('aria-label', 'add');
    submitButton.textContent = 'Добавить'; // замена на i18n.t(...)

    submitButtonDiv.append(submitButton);
    formDivElRow.append(formDivElCol); 
    formDivElRow.append(submitButtonDiv);
    form.append(formDivElRow);

    elements.rssInput.append(rssHeading);
    elements.rssInput.append(rssPEl);
    elements.rssInput.append(form);

    const rssExampleEl = document.createElement('p');
    rssExampleEl.classList.add('mt-2', 'mb-0', 'text-muted');
    rssExampleEl.textContent = 'Пример: https://ru.hexlet.io/lessons.rss';
    elements.rssInput.append(rssExampleEl);
  };

  /* const watchedState = onChange(state, (path) => {
    switch(path) {
      case 'form.status':
        renderForm();
        // getFormElements();
        break;
      case 'form.errors':
        handleErrors();
        break;
      case 'form.valid':
        clearErrors();
        break; 
      default:
       break;
    } 
  }); */

  renderForm();
  // return watchedState;
};
