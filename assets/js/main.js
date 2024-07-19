const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-url="https://pokeapi.co/api/v2/pokemon/${pokemon.number}/">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            <a class="button" href="#popup">Stats</a>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        document.querySelectorAll('.pokemon .button').forEach(item => {
            item.addEventListener('click', event => {
                const url = item.closest('.pokemon').getAttribute('data-url');
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('pokemonName').textContent = data.name;
                        document.getElementById('pokemonType').textContent = data.types.map(type => type.type.name).join(', ');
                        document.getElementById('pokemonStats').textContent = `
                            Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}
                            Base Experience: ${data.base_experience}
                            Height: ${data.height / 10}m
                        `;
                        document.getElementById('pokemonImage').src = data.sprites.other['official-artwork'].front_default;
                    });
            });
        });
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
