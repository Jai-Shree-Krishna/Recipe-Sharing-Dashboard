import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model if applicable
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }, // Reference to the Recipe model
  datetime: { type: Date, default: Date.now } // Date and time of the visit
});

const Visitor = mongoose.model('Visitor', VisitorSchema);

export default Visitor;
