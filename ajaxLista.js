const HERO_URL =
  "https://us-central1-itfighters-hero.cloudfunctions.net/api/hero";
window.onload = () => {
  //pobieramy wszystkie elementy z listy w section na dole
  const heroList = document.querySelector("#heroList");
  const elSuperhero = document.querySelector("#superhero");
  const elId = document.querySelector("#heroId");
  const elHeroUrl = document.querySelector("#heroUrl");
  const firstApp = document.querySelector("#FirstAppearance");
  const characters = document.querySelector("#characters");
  const publisher = document.querySelector("#publisher");
  const description = document.querySelector("#description");
  var addBtn = document.getElementById("addButton");

  //pusta tablica z AllHeros gdzie bedziemy przchowywac odpowiedz z serwera
  let allHeroes = [];

  //pobieramy z serwera liste i wrzucamy je do tablicy allHeros, nastepnie na podstawie
  //tej tablicy generujemy liste elementow
  function getFromServer() {
    $.get(HERO_URL, function(responeFromServer) {
      allHeroes = responeFromServer;
      generateList(allHeroes);
    });
  }
  // pobieramy dane z serwera - dziala
  getFromServer();

  //pobieramy value z inputow i na ich podstawie tworzymy nowego superbohatera - dziala!!!!
  function createElement() {
    debugger;
    var nameSuperhero = document.getElementById("nameInput");
    var picture = document.getElementById("pictureInput");
    var appearance = document.getElementById("appearanceInput");
    var characters = document.getElementById("caractersInput");
    var publisher = document.getElementById("publisherInput");
    var description = document.getElementById("descriptionInput");
    let newHero = {
      superhero: nameSuperhero.value,
      publisher: publisher.value,
      firstAppearance: appearance.value,
      characters: characters.value,
      url: picture.value,
      description: description.value
    };
    $.post(HERO_URL, newHero).done(alert("Dodales element"));
    clearList(heroList);
    getFromServer();
    generateList(allHeroes);
  }

  addBtn.addEventListener("click", function create(event) {
    event.preventDefault();
    createElement();
  });
  function clearList(list) {
    list.innerHTML = [];
  }
  //tworzymy liste elementow z odpowiedzi z serwera, tworzymy buttony do obu, dodajemy im
  //add event listenery i przypisujemy atrybuty id
  function generateList(heroes) {
    heroes.forEach(hero => {
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
      // deleteBtn.addEventListener("click", editHero);
      li.appendChild(editBtn);

      //poieramy dane z serwera dla kliknietego elementu i je wyswietlamy w hero list
      //to wyswietlanie w hero list dziala

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
        },
        error: function(data) {
          console.log("Error:", data);
        }
      }).done(alert("Usunąłęś element"));
      debugger;
      console.log(heroList);
      clearList(heroList);
      getFromServer();
      generateList(allHeroes);
    }
  }
};