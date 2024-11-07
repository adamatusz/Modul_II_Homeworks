const fetchAndStoreCharacters = async () => {
  try {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const data = await response.json();
    const characters = data.results.slice(0, 20).map((character) => ({
      id: character.id,
      name: character.name,
      status: character.status,
      species: character.species,
      image: character.image,
    }));

    characters.forEach(async (character) => {
      await fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      });
    });
  } catch (error) {
    console.error("Coś nie tak:", error);
  }
};

// fetchAndStoreCharacters();

let currentPage = 1;
let searchValue = "";
let characterStatus = "alive";
let maxPages;

const brickBox = document.getElementById("brick-container");
const searchInput = document.getElementById("search");
const selectStatus = document.querySelectorAll('input[name="status"]');
const newCharacterName = document.getElementById("new-character");
const newStatus = document.getElementById("new-status");
const newSpecies = document.getElementById("new-species");

const fetchCharacter = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/characters?_page=${currentPage}&_limit=5&status_like=${characterStatus}&name_like=${searchValue}`
    );
    const data = await response.json();
    const totalCharacters = response.headers.get("X-Total-Count");
    maxPages = Math.ceil(totalCharacters / 5);
    if (data.length === 0) {
      createNoResutlMessage();
    } else {
      renderCharactersBrick(data);
    }
  } catch (error) {
    console.error("Pobieranie danych nawala", error);
  }
};
fetchCharacter();

const renderCharactersBrick = (characters) => {
  brickBox.innerHTML = "";

  characters.forEach((character) => {
    const brick = document.createElement("div");
    brick.classList.add("brick");
    brick.innerHTML = `
      <img src=${character.image} alt=${character.name}>
      <h2>${character.name}</h2>
      <div class=brick-info>
      <p>Status: ${character.status}</p>
      <p>Gatunke: ${character.species}</p>
      <button class="delete-button" onclick="deleteCharacter(${character.id}, event)">Usuń</button>
      </div>`;
    brickBox.append(brick);
  });
};

const addCharacter = async () => {
  if (!newCharacterName.value || !newSpecies.value) {
    return alert("Pole jest wymagane");
  }
  const postData = {
    name: newCharacterName.value,
    status: newStatus.value,
    species: newSpecies.value,
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  };
  try {
    await fetch(`http://localhost:3000/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    newCharacterName.value = "";
    newStatus.value = "";
    newSpecies.value = "";
    fetchCharacter();
  } catch (error) {
    console.error("Błąd przy tworzeniu postaci", error);
  }
};

const deleteCharacter = async (id, event) => {
  event.preventDefault();
  try {
    await fetch(`http://localhost:3000/characters/${id}`, {
      method: "DELETE",
    });
    fetchCharacter();
  } catch (error) {
    console.error("Usuwaniu postaci nie daje oczekiwanych efektów", error);
  }
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
  message.innerHTML = `<p id ="message" >Nie znaleziono postaci spełniających kryteria wyszukiwania.</p>`;
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
