// https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple // This is API

// Match the elements form doc
const categories = document.querySelectorAll(".category");
const difficulties = document.querySelectorAll(".difficulty");
const questionHtml = document.querySelector(".question");
const answerBox = document.querySelectorAll(".answers .col");
const answersHtml = document.querySelectorAll(".answer");
const totalQuestions = document.querySelector(".total-questions");
const correctNumber = document.querySelector(".correct-num");
const wrongNumber = document.querySelector(".wrong-num");
const time = document.querySelector(".time");
const gameEnd = document.querySelector(".game-over");
const restartBtn = document.querySelector(".btn-restart");
const backBtn = document.querySelector(".btn-back");

// Get data from doc
let getCategory = "";
let getDifficulty = "";

// Get question data from API
let questionFromApi = "";
let answersFromApi = [];
let correctAnswer = "";
let data = {};

// Var for change a question
let countQuestion = 0;

// Var for get correct & wrong numbers
let wrongNum = 0;
let correctNum = 0;

let clearSetIntraver;

let answerState = false;

categories.forEach((category) => {
  category.addEventListener("click", () => {
    document.querySelector(".category-container").classList.add("to-up");
    getCategory = category.getAttribute("data-category");
  });
});

backBtn.addEventListener("click", () => {
  document.querySelector(".category-container").classList.remove("to-up");
});

difficulties.forEach((difficulty) => {
  difficulty.addEventListener("click", () => {
    document.querySelector(".difficulty-container").classList.add("to-down");
    document.body.style.overflow = "hidden";
    getDifficulty = difficulty.getAttribute("data-difficulty");

    let api = `https://opentdb.com/api.php?amount=10&category=${getCategory}&difficulty=${getDifficulty}&type=multiple`;

    getDataFromApi(api);
  });
});

async function getDataFromApi(API) {
  await fetch(API)
    .then((res) => res.json())
    .then(({ results }) => {
      data = results;
      showDataInPage(data);
    });

  clearSetIntraver = setInterval(() => {
    endOfTime();
  }, 1000);
}

function showDataInPage(data) {
  data = data[countQuestion];

  let myElement = document.createElement("div");

  myElement.innerHTML = data.correct_answer;

  correctAnswer = myElement.textContent;

  questionFromApi = data.question;

  answersFromApi = [...data.incorrect_answers, data.correct_answer].sort();

  questionHtml.innerHTML = questionFromApi;

  answersHtml.forEach(
    (answer, index) => (answer.innerHTML = answersFromApi[index])
  );

  data = {};
}

answerBox.forEach((ele) => {
  ele.addEventListener("click", () => {
    if (!answerState) {
      checkAnswer(ele);
    }
  });
});

function checkAnswer(ele) {
  let answer = ele.querySelector(".answer");

  if (answer.textContent === correctAnswer) {
    correctNum++;
    ele.classList.add("correct");
    setTimeout(() => {
      ele.classList.remove("correct");
    }, 1000);

    setTimeout(() => {
      showDataInPage(data);
      answerState = !answerState;

      document.querySelector(".count").textContent = `${
        countQuestion + 1 < 10
          ? `0${countQuestion + 1}`
          : `${countQuestion + 1}`
      }/10`;
    }, 2000);
  } else {
    wrongNum++;
    ele.classList.add("wrong");
    setTimeout(() => {
      ele.classList.remove("wrong");
    }, 1000);

    setTimeout(() => {
      showDataInPage(data);
      answerState = !answerState;

      document.querySelector(".count").textContent = `${
        countQuestion + 1 < 10
          ? `0${countQuestion + 1}`
          : `${countQuestion + 1}`
      }/10`;
    }, 2000);

    getCorrectAnswerAfterChoose();
  }

  if (countQuestion < 9) {
    countQuestion++;
  } else {
    gameOver();
  }

  answerState = !answerState;
}

function getCorrectAnswerAfterChoose() {
  setTimeout(() => {
    answerBox.forEach((ele) => {
      let target = ele.querySelector(".answer");

      if (target.textContent == correctAnswer) {
        target.parentElement.classList.add("correct");
      }

      setTimeout(() => {
        target.parentElement.classList.remove("correct");
      }, 1000);
    });
  }, 1000);
}

let seconds = 60;
function endOfTime() {
  let remSecond = seconds % 60;
  let minute = parseInt(seconds / 60);
  seconds--;

  time.textContent = `${minute < 10 ? `0${minute}` : `${minute}`}:${
    remSecond < 10 ? `0${remSecond}` : `${remSecond}`
  }`;

  if (seconds < 0) {
    clearInterval(clearSetIntraver);
    gameOver();
  }
}

function gameOver() {
  totalQuestions.textContent = `Total questions: ${countQuestion + 1}`;
  correctNumber.textContent = `Correct answer: ${correctNum}`;
  wrongNumber.textContent = `Wrong answer: ${wrongNum}`;

  setTimeout(() => {
    gameEnd.classList.add("end");
  }, 2000);
}

restartBtn.addEventListener("click", () => window.location.reload());
