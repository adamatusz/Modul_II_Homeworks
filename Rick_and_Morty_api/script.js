let currentPage = 1;
let searchValue = "";
let characterStatus = "alive";
let characters = [];
let maxPages;

const brickBox = document.getElementById("brick-container");
const searchInput = document.getElementById("search");
const selectStatus = document.querySelectorAll('input[name="status"]');

const fetchCharacter = async () => {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${currentPage}&name=${searchValue}&status=${characterStatus}`
    );
    const data = await response.json();
    // console.log(data)
    characters = data.results;
    maxPages = data.info.pages;
    renderCharactersBrick(data.results);
  } catch (error) {
    console.error("Coś nie tak", error);
    createNoResutlMessage();
  }
};

const renderCharactersBrick = (characters) => {
  brickBox.innerHTML = "";

  characters.forEach((character) => {
    const brick = document.createElement("div");
    brick.classList.add("brick");
    brick.innerHTML = `
    <img src=${character.image} alt=${character.name}>
    <div class="font-size-character-name">${character.name}</div>
    <div class=brick-info>
    <p>Status: ${character.status}</p>
    <p>Gatunek: ${character.species}</p>
    </div>`;
    brickBox.append(brick);
  });
};

searchInput.addEventListener("input", () => {
  searchValue = searchInput.value;
  currentPage = 1;
  fetchCharacter();
});

const nextPage = () => {
  if (currentPage < maxPages) currentPage++;
  fetchCharacter();
};

const prevPage = () => {
  if (currentPage > 1) currentPage--;
  fetchCharacter();
};

const createNoResutlMessage = () => {
  brickBox.innerHTML = "";
  const message = document.createElement("div");
  const inMessage = '<p id ="message" >Brak elementów do wyświetlenia.</p>';
  message.innerHTML = inMessage;
  brickBox.append(message);
};

selectStatus.forEach((radio) => {
  if (radio.value === "alive") {
    radio.checked = true;
  }

  radio.addEventListener("change", (event) => {
    characterStatus = event.target.value;
    currentPage = 1;
    fetchCharacter();
  });
});

fetchCharacter();
