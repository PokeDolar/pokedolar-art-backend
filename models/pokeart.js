const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokeArtSchema = new Schema({
  name: { type: "String", required: true },
  pokemon: { type: Schema.Types.ObjectId, ref: 'Pokemon' },
  file: { type: 'String', required: true},
  createdAt: { type: 'Date', default: Date.now, required: true},
  author: { type: 'String', required: false},
  //Posts
  postAmount: { type: "Number", required: true, default:0 },
  firstPosted: { type: "Date", required: false },
  lastPosted: { type: "Date", required: false },
  lastTweet: { type: 'String', required: false},
  
  //official art stuff
  isOfficial: { type: 'Boolean', required: true, default: false},
  creatorText: { type: 'String', required: false},
  

  //admin
  approved: { type: 'Boolean', required: true, default: false}
});


module.exports = mongoose.model('PokeArt', pokeArtSchema);