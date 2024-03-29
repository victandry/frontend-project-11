import onChange from 'on-change';

export default (elements, i18n, state) => {
  const renderForm = () => {
    const rssHeading = elements.rssInput.querySelector('h1');
    rssHeading.textContent = i18n.t('heading');

    const rssPEl = elements.rssInput.querySelector('.lead');
    rssPEl.textContent = i18n.t('subHeading');

    const urlInput = elements.rssInput.querySelector('#url-input');
    urlInput.setAttribute('placeholder', i18n.t('inputRssFieldName'));

    const labelUrlInput = urlInput.nextElementSibling;
    labelUrlInput.textContent = i18n.t('inputRssFieldName');

    const submitButton = elements.form.querySelector('button');
    submitButton.textContent = i18n.t('submitButton');

    const exampleEl = elements.form.nextElementSibling;
    exampleEl.textContent = i18n.t('example');
  };

  const renderFeeds = () => {
    const [feedsDiv] = elements.rssOutput.getElementsByClassName("feeds");
    feedsDiv.innerHTML = '';
    // feedsDiv.textContent = "Success!";
    const cardDiv = document.createElement("div");
    cardDiv.classList.add('card', 'border-0');

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add('card-body-0');

    const cardBodyTitle = document.createElement("h2");
    cardBodyTitle.classList.add('card-title', 'h4');
    cardBodyTitle.textContent = "Фиды";

    cardBodyDiv.appendChild(cardBodyTitle);

    cardDiv.appendChild(cardBodyDiv);

    const feedsList = document.createElement("ul");
    feedsList.classList.add('list-group', 'border-0', 'rounded-0');

    for (let i = state.feeds.length - 1; i >= 0; i -= 1) {
      // console.log('title of the feed', title);
      const { title, description } = state.feeds[i];
      console.log(title, description);

      const feedsListItem = document.createElement("li");
      feedsListItem.classList.add('list-group-item', 'border-0', 'border-end-0');
      
      const feedsListItemTitle = document.createElement("h3");
      feedsListItemTitle.classList.add('h6', 'm-0');
      feedsListItemTitle.textContent = title;

      const feedsListItemDescription = document.createElement("p");
      feedsListItemDescription.classList.add('m-0', 'small', 'text-black-50');
      feedsListItemDescription.textContent = description;

      feedsListItem.appendChild(feedsListItemTitle);
      feedsListItem.appendChild(feedsListItemDescription);

      feedsList.appendChild(feedsListItem);
    }

    cardDiv.appendChild(feedsList);

    feedsDiv.appendChild(cardDiv);
  };

  const renderFeedItems = () => {
    const [postsDiv] = elements.rssOutput.getElementsByClassName("posts");
    postsDiv.innerHTML = '';
    // feedItemsDiv.textContent = "Awesome post!"
    // console.log('lets pretend I render feed items');
    const cardDiv = document.createElement("div");
    cardDiv.classList.add('card', 'border-0');

    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.classList.add('card-body');

    const cardBodyTitle = document.createElement("h2");
    cardBodyTitle.classList.add('card-title', 'h4');
    cardBodyTitle.textContent = "Посты";

    cardBodyDiv.appendChild(cardBodyTitle);

    cardDiv.appendChild(cardBodyDiv);

    const postsList = document.createElement("ul");
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    for (let i = state.feedItems.length - 1; i >= 0; i -= 1) {
      const { feedId, title, link, description } = state.feedItems[i];

      const post = document.createElement("li");
      post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      
      const postLink = document.createElement("a");
      postLink.setAttribute('href', link);
      postLink.setAttribute("target", "_blank");
      postLink.setAttribute("data-id", feedId);
      postLink.classList.add('fw-bold');
      postLink.relList.add('noopener', 'noreferrer');
      postLink.textContent = title;

      const postButton = document.createElement("button");
      postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      postButton.setAttribute("data-id", feedId);
      postButton.setAttribute("data-bs-toggle", "modal");
      postButton.setAttribute("data-bs-target", "#modal");
      postButton.textContent = 'Просмотр';

      post.appendChild(postLink);
      post.appendChild(postButton);

      postsList.appendChild(post);
    }

    cardDiv.appendChild(postsList);
    postsDiv.appendChild(cardDiv);
  };

  const handleErrors = () => {
    const errEl = document.createElement('p');
    errEl.classList.add('feedback', 'm-0', 'position-absolute', 'small', 'text-danger');
    const [errorKey] = state.rssForm.errors;
    errEl.textContent = i18n.t(errorKey);
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
    console.log(successEl.textContent);

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
      case 'feeds':
        renderFeeds();
      case 'feedItems':
        renderFeedItems();
      default:
       break;
    } 
  });

  return watchedState;
};
