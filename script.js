const questions = [
  { question: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"], answer: "JavaScript" },
  { question: "What does CSS stand for?", options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"], answer: "Cascading Style Sheets" },
  { question: "What does HTML stand for?", options: ["Hypertext Markup Language", "Hyperloop Machine Language", "Hyperlink Mark Language", "Helicopters Terminals Motorboats Lamborghinis"], answer: "Hypertext Markup Language" },
  { question: "What year was JavaScript launched?", options: ["1996", "1995", "1994", "none of the above"], answer: "1995" },
  { question: "Which company developed JavaScript?", options: ["Netscape", "Microsoft", "Sun Microsystems", "Oracle"], answer: "Netscape" }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timer;
let timeLeft = 15;

// UI elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const timeEl = document.getElementById("time");
const progressFill = document.getElementById("progress-fill");
const feedbackEl = document.getElementById("feedback");
const timeCircle = document.getElementById("time-circle");
const circleCircumference = 2 * Math.PI * 28; // r = 28

// Sounds
const correctSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const wrongSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

startBtn.onclick = startQuiz;
nextBtn.onclick = nextQuestion;
prevBtn.onclick = prevQuestion;
restartBtn.onclick = restartQuiz;

function startQuiz() {
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  showQuestion();
}

function showQuestion() {
  resetTimer();
  startTimer();
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;
    li.onclick = () => selectAnswer(li, option);
    if (userAnswers[currentQuestion] === option) {
      li.classList.add(option === q.answer ? "correct" : "wrong");
    }
    optionsEl.appendChild(li);
  });
  prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
  nextBtn.textContent = currentQuestion === questions.length - 1 ? "Finish" : "Next";

  updateProgress();
}

function selectAnswer(li, option) {
  if (userAnswers[currentQuestion]) return;
  userAnswers[currentQuestion] = option;
  const q = questions[currentQuestion];
  const optionElements = optionsEl.querySelectorAll("li");
  
  optionElements.forEach(el => {
    if (el.textContent === q.answer) {
      el.classList.remove("correct");
      void el.offsetWidth;
      el.classList.add("correct");
    }
    if (el.textContent === option && option !== q.answer) {
      el.classList.remove("wrong");
      void el.offsetWidth;
      el.classList.add("wrong");
    }
  });

  // Play sounds
  if (option === q.answer) {
    correctSound.play();
  } else {
    wrongSound.play();
  }

  clearInterval(timer);
}

function nextQuestion() {
  if (!userAnswers[currentQuestion]) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function finishQuiz() {
  clearInterval(timer);
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  score = userAnswers.filter((ans, i) => ans === questions[i].answer).length;
  scoreEl.textContent = `${score} / ${questions.length}`;
  
  // Feedback message
  let percent = (score / questions.length) * 100;
  if (percent === 100) feedbackEl.textContent = "🌟 Excellent! Perfect Score!";
  else if (percent >= 60) feedbackEl.textContent = "👍 Good job! Keep practicing.";
  else feedbackEl.textContent = "💡 Don’t worry, try again!";
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
}

function startTimer() {
  timeLeft = 15;
  timeEl.textContent = timeLeft;
  updateCircle();

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    updateCircle();

    if (timeLeft <= 0) {
      clearInterval(timer);
      if (!userAnswers[currentQuestion]) {
        userAnswers[currentQuestion] = null;
      }
      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
      } else {
        finishQuiz();
      }
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timeEl.textContent = timeLeft;
  timeCircle.classList.remove("warning");
  timeCircle.classList.add("safe");
  updateCircle();
}

function updateCircle() {
  const progress = (timeLeft / 15) * circleCircumference;
  timeCircle.style.strokeDasharray = circleCircumference;
  timeCircle.style.strokeDashoffset = circleCircumference - progress;

  // Change color based on time left
  if (timeLeft <= 5) {
    timeCircle.classList.remove("safe");
    timeCircle.classList.add("warning");
  } else {
    timeCircle.classList.remove("warning");
    timeCircle.classList.add("safe");
  }
}

function updateProgress() {
  let progressPercent = ((currentQuestion + 1) / questions.length) * 100;
  progressFill.style.width = progressPercent + "%";
}
