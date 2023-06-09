const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
    },
    answeredQuestions: 
       [{type: Schema.Types.ObjectId, ref:"Question"}]
      
    
  
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
