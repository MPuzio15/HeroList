const HERO_URL =
  "https://us-central1-itfighters-hero.cloudfunctions.net/api/hero";
window.onload = () => {
  //pobieramy wszystkie elementy DOM

  let heroList;
  let elSuperhero;
  let elId;
  let elHeroUrl;
  let firstApp;
  let characters;
  let publisher;
  let description;
  let addBtn;
  let nameSuperhero;
  let pictureInput;
  let appearanceInput;
  let charactersInput;
  let publisherInput;
  let descriptionInput;

  let allHeroes = [];
  let edited = 0;
  getFromServer();
  generateList(allHeroes);
  addButtonEvent();

  function getFromServer() {
    $.get(HERO_URL, function(responeFromServer) {
      allHeroes = responeFromServer;
      generateList(allHeroes);
    });
  }

  function generateList(heroes) {
    heroes.forEach(hero => {
      bindDOMElements();
      const li = document.createElement("li");
      li.setAttribute("id", hero.id);
      li.innerText = hero.superhero + " : " + hero.publisher;
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.setAttribute("id", hero.id);
      deleteBtn.addEventListener("click", deleteHero);
      li.appendChild(deleteBtn);
      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.setAttribute("id", hero.id);
      editBtn.addEventListener("click", editHero);
      li.appendChild(editBtn);

      li.addEventListener("click", event => {
        const liElement = event.target;
        const heroId = liElement.getAttribute("id");
        const heroDetailsURL = HERO_URL + "/" + heroId;

        $.get(heroDetailsURL, function(result) {
          console.log(result);
          elId.innerText = result.id;
          elSuperhero.innerText = result.superhero;
          elHeroUrl.setAttribute("src", result.url);
          firstApp.innerText = result.firstAppearance;
          characters.innerText = result.characters;
          publisher.innerText = result.publisher;
          description.innerText = result.description;
        });
      });
      heroList.appendChild(li);
    });
  }
  function addButtonEvent() {
    
    let addBtn = document.getElementById("addButton");

    addBtn.addEventListener("click", function create(event) {
      event.preventDefault();
      createElement();
    });
  }

  function createElement() {
    debugger;
    bindDOMElements();

    let newHero = {
      superhero: nameSuperhero.value,
      publisher: publisherInput.value,
      firstAppearance: appearanceInput.value,
      characters: charactersInput.value,
      url: pictureInput.value,
      description: descriptionInput.value
    };
    postNewHero(newHero);
  }

  function postNewHero(newHero) {
    $.ajax({
      type: "POST",
      url: HERO_URL,
      newHero,
      success: function(data) {
        console.log(data);
        alert("Dodałeś element");
        clearList(heroList);
        getFromServer();
        clearInputs();
      },
      error: function(data) {
        console.log("Error:", data);
      }
    });
  }

  function editHero(element) {
    debugger;
    edited++;
    let idItemToEdit = parseInt(element.target.getAttribute("id"));
    const heroDetailsURL = HERO_URL + "/" + idItemToEdit;
    // let heroToEditValue = allHeroes[idItemToEdit - 1];
    // console.log(heroToEditValue);
    getDetailsOfEditedItem(heroDetailsURL);

    function getDetailsOfEditedItem(url) {
      $.get(url, function(result) {
        console.log(result);
        createEdited(result);
        let editedHero = createEdited(result);
        addEditedOnClick(addBtn);
        clearInputs();
      });
    }
    function createEdited(result) {
      debugger;
      bindDOMElements();
      console.log(result.superhero);
      nameSuperhero.value = result.superhero;
      publisherInput.value = result.publisher;
      pictureInput.value = result.url;
      appearanceInput.value = result.firstAppearance;
      charactersInput.value = result.characters;
      descriptionInput.value = result.description;

      let editedHero = {
        superhero: nameSuperhero.value,
        publisher: publisherInput.value,
        firstAppearance: appearanceInput.value,
        characters: charactersInput.value,
        url: pictureInput.value,
        description: descriptionInput.value
      };
      return editedHero;
    }
    if (edited !== 0) {
      function addEditedOnClick(addBtn) {
        addBtn.addEventListener("click", (editedHero, heroDetailsURL) => {
          $.ajax({
            type: "PUT",
            url: heroDetailsURL,
            editedHero,
            success: function(data) {
              console.log(data);
              clearList(heroList);
              getFromServer();
              generateList(allHeroes);
            },
            error: function(data) {
              console.log("Error:", data);
            }
          });
        });
      }
    }
  }

  //pobieramy z serwera liste i wrzucamy je do tablicy allHeros, nastepnie na podstawie
  //tej tablicy generujemy liste elementow

  function clearList(list) {
    list.innerHTML = [];
  }

  function clearInputs() {
    let inputs = document.querySelectorAll(input);
    inputs.forEach(input => {
      input.innerText = "";
    });
  }

  function deleteHero(event) {
    debugger;
    event.preventDefault();

    let idItemToRemove = parseInt(event.target.getAttribute("id")); // rzutuje stringa na numbera
    const heroDetailsURL = HERO_URL + "/" + idItemToRemove;
    console.log(idItemToRemove);
    $.ajax({
      type: "DELETE",
      url: heroDetailsURL,
      success: function(data) {
        console.log(data);
        clearList(heroList);
        getFromServer();
      },
      error: function(data) {
        console.log("Error:", data);
      }
    }).done(alert("Usunąłęś element"));
    debugger;
    console.log(heroList);
  }
  function bindDOMElements() {
    heroList = document.querySelector("#heroList");
    elSuperhero = document.querySelector("#superhero");
    elId = document.querySelector("#heroId");
    elHeroUrl = document.querySelector("#heroUrl");
    firstApp = document.querySelector("#FirstAppearance");
    characters = document.querySelector("#characters");
    publisher = document.querySelector("#publisher");
    description = document.querySelector("#description");
    addBtn = document.getElementById("addButton");
    nameSuperhero = document.getElementById("nameInput");
    pictureInput = document.getElementById("pictureInput");
    appearanceInput = document.getElementById("appearanceInput");
    charactersInput = document.getElementById("caractersInput");
    publisherInput = document.getElementById("publisherInput");
    descriptionInput = document.getElementById("descriptionInput");
  }
};
