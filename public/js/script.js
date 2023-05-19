// const axios = require("axios");

document.addEventListener("DOMContentLoaded", () => {
  console.log("coding-generator JS imported successfully!");
});

const generateBtn = document.getElementById("generate-text-button");
const descriptionArea = document.getElementById("description");
const correctArea = document.getElementById("correct");
const incorrectArea1 = document.getElementById("false1");
const incorrectArea2 = document.getElementById("false2");
const incorrectArea3 = document.getElementById("false3");

generateBtn.addEventListener("click", async () => {
  try {
    const questionResponse = await axios.post("/api/generate-text");
    console.log("Question response from API", questionResponse.data);

    // Set the generated question in the description area
    descriptionArea.value = questionResponse.data.description;

    // Now, send a second request to generate the correct answer
    const answerResponse = await axios.post("/api/generate-correct-answer", { question: questionResponse.data.description });
    console.log("Answer response from API", answerResponse.data);

    // Set the generated answer in the correct area
    correctArea.value = answerResponse.data.correct;

    const incorrectAnswers1 = await axios.post("/api/generate-false-answer", {
      question: questionResponse.data.description,
      correct: answerResponse.data.correct,
    });
    incorrectArea1.value = incorrectAnswers1.data.incorrect1;

    const incorrectAnswers2 = await axios.post("/api/generate-false-answer2", {
      question: questionResponse.data.description,
      correct: answerResponse.data.correct,
      incorrect1: incorrectAnswers1.data.incorrect1,
    });
    incorrectArea2.value = incorrectAnswers2.data.incorrect2;

    const incorrectAnswers3 = await axios.post("/api/generate-false-answer3", {
      question: questionResponse.data.description,
      correct: answerResponse.data.correct,
      incorrect1: incorrectAnswers1.data.incorrect1,
      incorrect2: incorrectAnswers2.data.incorrect2,
    });
    incorrectArea3.value = incorrectAnswers3.data.incorrect3;
  } catch (err) {
    console.log("error when getting API data", err);
  }
});
