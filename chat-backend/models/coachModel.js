const clientSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // References the User model
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",  // Reference to the Organization model
      required: true,
    },
  });
  
module.exports = mongoose.model('Client', clientSchema);