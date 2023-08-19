const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";

function getPokemonData(id) {
  return fetch(URL + id)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function createPokemonElement(poke) {
  let tipos = poke.types.map(
    (type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`
  );
  tipos = tipos.join("");

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = document.createElement("div");
  div.classList.add("pokemon");

  // Construir el contenido del Pokemon

  const contenidoPokemon = `
    <p class="pokemon-id-back">${pokeId}</p>
    <div class="pokemon-imagen">
        <img src="${poke.sprites.other["official-artwork"].front_default}"
         alt="${poke.name}">
    </div>
    <div class="pokemon-info">
        <div class="nombre-contenedor">
            <p class="pokemon-id">#${pokeId}</p>
            <h2 class="pokemon-nombre">${poke.name}</h2>
        </div>
        <div class="pokemon-tipos">
            ${tipos}
        </div>
        <div class="pokemon-stats">
            <p class="stat">${poke.height / 10} m</p>
            <p class="stat">${poke.weight / 10} kg</p>
        </div>
    </div>
      `;

  //Asignar el contenido al elemento
  div.innerHTML = contenidoPokemon;

  // Agregar el elemento al contenedor

  listaPokemon.appendChild(div);
}

function filterAndDisplayPokemons(filter) {
  listaPokemon.innerHTML = "";

  for (let i = 1; i <= 151; i++) {
    getPokemonData(i).then((data) => {
      if (filter(data)) {
        createPokemonElement(data);
      }
    });
  }
}
function displayAllPokemons() {
  filterAndDisplayPokemons(() => true); // Mostrar todos los Pokémon
}
function displayFilteredByType(event) {
    const botonId = event.currentTarget.id;
    console.log("Botón presionado:", botonId); // Agrega este console.log

    filterAndDisplayPokemons(data =>
        botonId === "see-all" ||
        botonId === "ver-todos" ||
        data.types.some(type => {
          console.log("Tipo del Pokémon:", type.type.name.toLowerCase()); // Agrega este console.log
          return type.type.name.toLowerCase() === botonId;
        })
      );
    }
  
  botonesHeader.forEach(boton =>
    boton.addEventListener("click", displayFilteredByType)
  );
  
  document.getElementById("see-all").addEventListener("click", displayAllPokemons);
  
  function fetchAndDisplayPokemons() {
    const fetchPromises = Array.from({ length: 151 }, (_, i) => getPokemonData(i + 1));
  
    Promise.all(fetchPromises).then(pokemonDataArray => {
      pokemonDataArray.forEach(data => createPokemonElement(data));
    });
  }
  
  fetchAndDisplayPokemons(); // Llamada inicial para mostrar todos los Pokémon al cargar la página
