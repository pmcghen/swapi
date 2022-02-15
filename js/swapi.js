const getCharacters = arg => {
  let apiUrl = 'https://swapi.dev/api/people/'

  if (arg !== undefined) {
    apiUrl += arg
  }

  const characterList = document.getElementById('character-list');
  characterList.innerHTML = `<img src="assets/loading.gif" alt="" class="loader">`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayCharacters(data.results);
      displayPagination(data.next, data.previous);
    })
    .catch((err) => {
      characterList.innerHTML = `
        <h2>Uh oh!</h2>
        <iframe src="https://giphy.com/embed/bq6F8QYqBU7Yc" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        <p><a href="https://giphy.com/gifs/bq6F8QYqBU7Yc">via GIPHY</a></p>
        <p>We ran into a problem. Please try again.</p>
      `;
      console.log(err);
    });
};

const searchInput = document.getElementById('search');

searchInput.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) {
    getCharacters(`?search=${event.target.value}`);
  }
});

document.getElementById('search-btn').addEventListener('click', function () {
  getCharacters(`?search=${searchInput.value}`);
});

const displayCharacters = characters => {
  const characterList = document.getElementById('character-list');

  characterList.innerHTML = '';

  for (const character of characters) {
    for (const p in character) {
      if (character[p] === 'unknown') {
        delete character[p]
      }
    }

    const characterAttributes = document.createElement('ul');

    if (character.height) {
      const characterHeight = document.createElement('li');
      characterHeight.innerHTML = `<span>Height</span>: ${character.height}`;
      characterAttributes.appendChild(characterHeight);
    }

    if (character.mass) {
      const characterMass = document.createElement('li');
      characterMass.innerHTML = `<span>Mass</span>: ${character.mass}`;
      characterAttributes.appendChild(characterMass);
    }

    if (character.eye_color) {
      const characterEyeColor = document.createElement('li');
      characterEyeColor.innerHTML = `<span>Eye color:</span> ${character.eye_color}`;
      characterAttributes.appendChild(characterEyeColor);
    }

    if (character.birth_year) {
      const characterBirthYear = document.createElement('li');
      characterBirthYear.innerHTML = `<span>Birth year:</span> ${character.birth_year}`;
      characterAttributes.appendChild(characterBirthYear);
    }

    const characterFilmCount = document.createElement('li');
    characterFilmCount.innerHTML = `<span>Films</span>: ${character.films.length}`;
    characterAttributes.appendChild(characterFilmCount);

    const characterDetail = document.createElement('div')
    const characterName = document.createElement('h2');
    characterDetail.className = 'character-detail';
    characterName.innerHTML = character.name;

    characterDetail.appendChild(characterName);
    characterDetail.appendChild(characterAttributes);
    characterList.appendChild(characterDetail);
  }
};

const displayPagination = (next, prev) => {
  const pagination = document.querySelector('.pagination');
  const nextBtn = document.createElement('button');
  const prevBtn = document.createElement('button');

  pagination.innerHTML = '';

  nextBtn.innerText = 'Next';
  prevBtn.innerText = 'Previous';

  pagination.appendChild(prevBtn);
  pagination.appendChild(nextBtn);

  if (!next) {
    nextBtn.setAttribute('disabled', 'disabled')
  }

  if (!prev) {
    prevBtn.setAttribute('disabled', 'disabled')
  }

  if (next) {
    const nextPage = parseInt(next.slice(-1), 10);
    nextBtn.removeAttribute('disabled');
    nextBtn.addEventListener('click', function () {
      getCharacters(`?page=${nextPage}`);
    });
  }

  if (prev) {
    const prevPage = parseInt(prev.slice(-1), 10);
    prevBtn.dataset.nextPage = prevPage;
    prevBtn.removeAttribute('disabled');
    prevBtn.addEventListener('click', function () {
      getCharacters(`?page=${prevPage}`);
    });
  }
};

getCharacters();
