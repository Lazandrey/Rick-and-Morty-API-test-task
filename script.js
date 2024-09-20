const charactersWrapper = document.getElementById("characters-wrapper");

const getAllCharacters = async () => {
  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();
  return data.results;
};

const getAllCharactersFull = async () => {
  const response = await fetch("https://rickandmortyapi.com/api/character");
  const data = await response.json();
  let allChars = data.results;
  for (i = 2; i < data.info.pages; i++) {
    const nextResponse = await fetch(
      "https://rickandmortyapi.com/api/character/?page=" + i
    );
    const nextData = await nextResponse.json();
    allChars.push(...nextData.results);
  }
  return allChars;
};

const getAllLocations = async () => {
  const response = await fetch("https://rickandmortyapi.com/api/location");
  const data = await response.json();
  let allLoc = data.results;
  for (i = 2; i < data.info.pages; i++) {
    const nextResponse = await fetch(
      "https://rickandmortyapi.com/api/location?page=" + i
    );
    const nextData = await nextResponse.json();
    allLoc.push(...nextData.results);
  }
  return allLoc;
};

const getCharacterNameById = async (id) => {
  const response = await fetch(
    "https://rickandmortyapi.com/api/character/" + id
  );
  const data = await response.json();
  return data.name;
};

const getOrigin = (name) => {
  return name === "unknown" ? "-" : name;
};

const getLocationCard = (location) => {
  const locationName = document.createElement("h3");
  const locationDimension = document.createElement("p");
  const locationType = document.createElement("p");
  const locationCard = document.createElement("div");
  locationName.innerText = location.name;
  locationDimension.innerText = "Dimension :" + location.dimension;
  locationType.innerText = "Type :" + location.type;
  locationCard.append(locationName, locationDimension, locationType);
  locationCard.classList.add("character");
  locationCard.addEventListener("click", () => {
    console.log("Name: ", location.name);
  });
  return locationCard;
};

const getCharacterCard = (character) => {
  const characterName = document.createElement("h3");
  const characterSpecies = document.createElement("p");
  const characterOrigin = document.createElement("p");
  const characterImg = document.createElement("img");
  const characterCard = document.createElement("div");

  characterName.innerText = character.name;
  characterSpecies.innerText = "Species: " + character.species;
  characterOrigin.innerText = "Origin: " + getOrigin(character.origin.name);
  characterImg.src = character.image;
  characterCard.append(
    characterName,
    characterSpecies,
    characterOrigin,
    characterImg
  );
  characterCard.classList.add("character");
  characterCard.addEventListener("click", async () => {
    console.log("Name: ", character.name);
    localStorage.setItem("characterName", character.name);
    console.log("Name by Id: ", await getCharacterNameById(character.id));
  });
  return characterCard;
};

const buildCharacters = (characters, setLength) => {
  if (setLength === undefined) {
    setLength = characters.length;
  }

  [...characters]
    .slice(0, setLength)
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .forEach((character) => {
      charactersWrapper.append(getCharacterCard(character));
    });
};

const getMostUsedCharacter = (characters) => {
  return [...characters]
    .sort((a, b) => {
      return b.episode.length - a.episode.length;
    })
    .filter(
      (character, idx, arr) =>
        character.episode.length === arr[0].episode.length
    );
};

const buildMostUsedCharacter = (characters) => {
  const mostUsedCharacters = getMostUsedCharacter(characters);

  const mostUsedCharactersList = document.createElement("div");
  const mostUsedCharactersListTitle = document.createElement("h2");

  mostUsedCharactersList.setAttribute("class", "character border");

  mostUsedCharactersListTitle.innerText =
    "Appeared in episodes: " + mostUsedCharacters[0].episode.length;
  mostUsedCharactersList.append(mostUsedCharactersListTitle);
  mostUsedCharacters.forEach((character) => {
    mostUsedCharactersList.append(getCharacterCard(character));
  });

  charactersWrapper.append(mostUsedCharactersList);
};

const getMostPopulatedLocations = (locations) => {
  return [...locations]
    .sort((a, b) => {
      return b.residents.length - a.residents.length;
    })
    .filter(
      (location, idx, arr) =>
        location.residents.length === arr[0].residents.length
    );
};

const buildMostPopulatedLocations = (locations) => {
  const mostPopulatedLocations = getMostPopulatedLocations(locations);
  const mostPopulatedLocationsList = document.createElement("div");
  const mostPopulatedLocationsListTitle = document.createElement("h2");
  mostPopulatedLocationsList.setAttribute("class", "character border");

  mostPopulatedLocationsListTitle.innerText =
    "Most populated locations: " +
    mostPopulatedLocations[0].residents.length +
    " residenses";
  mostPopulatedLocationsList.append(mostPopulatedLocationsListTitle);
  mostPopulatedLocations.forEach((location) => {
    mostPopulatedLocationsList.append(getLocationCard(location));
  });

  charactersWrapper.append(mostPopulatedLocationsList);
};

const startApp = async () => {
  const characters = await getAllCharactersFull();
  const locations = await getAllLocations();

  console.log(characters);
  console.log(locations);

  buildMostUsedCharacter(characters);
  buildMostPopulatedLocations(locations);
  buildCharacters(characters, 100);
};

startApp();
