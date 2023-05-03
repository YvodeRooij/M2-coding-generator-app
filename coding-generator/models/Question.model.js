const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const questionSchema = new Schema(
    {
        description:{
            type: String,
            required: true
            
        },
        correct:{
            type: String,
            required: true
        },
        false1:{
            type: String,
            required: true
        },
        false2:{
            type: String,
            required: true
            
        },
        false3:{
            type: String,
            required: true
            
        }
    }
);

const Question = model("Question", questionSchema);

module.exports = Question;