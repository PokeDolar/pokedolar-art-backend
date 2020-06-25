const PokeArt = require("../models/pokeart");
const PokemonService = require("../services/pokemon.service");
const Pokemon = require("../models/pokemon");

async function getRandomPokeArt() {
  try {
    let randomPoke = await PokeArt.findOne({ approved: true })
      .select(["id", "name", "filePath", "author", "createdAt", "pokemon"])
      .sort("id")
      .populate("pokemon");
    return randomPoke;
  } catch (e) {
    throw new Error("Could not get all pokemons, please try again later");
  }
}

async function addPokeArt(pokeart, pokeid, name, author) {
  let pokemon = await PokemonService.getPokemon(pokeid);

  try {
    const newPokeArt = new PokeArt({
      name: name,
      pokemon: pokemon._id,
      filePath: `/${pokeart.uuid}/${pokeart.field}/${pokeart.filename}`,
      author: author,
    });

    let pokeArt = await newPokeArt.save();
    return pokeArt._id;
  } catch (e) {
    console.log(e);
    throw new Error("Could not save this pokemon to the database");
  }
}

async function getPokeArt(pokeArtId) {
  try {
    return await PokeArt.findOne({ _id: pokeArtId });
  } catch (e) {
    throw new Error(`Could not find pokemon wth id ${pokeArtId}`);
  }
}
async function deletePokeArt(pokeArtId) {
  try {
    let pokeart = await PokeArt.findOne({ _id: pokeArtId });
    let pokemon = await Pokemon.findById(pokeart.pokemon).populate('pokeArts');
    await pokemon.pokeArts.remove(pokeart);
    
    
    Promise.all([await pokemon.save(), await pokeart.remove()]);
    
    
    return pokeart;
  } catch (e) {
    console.log(e);
    throw new Error(`Could not delete ${pokeid}`);
  }
}

async function changeApprovalPokeArt(pokeArtId, approvalStatus) {
  try {
    let approvedPokeArt = await PokeArt.findOne({ _id: pokeArtId });
    approvedPokeArt.reviewed = true;
    approvedPokeArt.approved = approvalStatus;
    let pokemon = await Pokemon.findById(approvedPokeArt.pokemon).populate(
      "pokeArts"
    );
    if (approvedPokeArt.approved) {
      await pokemon.pokeArts.addToSet(approvedPokeArt);
    } else {
      await pokemon.pokeArts.remove(approvedPokeArt);
    }

    await Promise.all([approvedPokeArt.save(), pokemon.save()]);
    return true;
  } catch (e) {
    console.log(e);
    throw new Error("Could not approve PokeArt");
  }
}

module.exports = {
  getRandomPokeArt,
  addPokeArt,
  getPokeArt,
  deletePokeArt,
  changeApprovalPokeArt,
};