// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import question from "./test_2.json";

function App() {
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const testData = JSON.parse(JSON.stringify(question));
    setQuizData(testData);
  }, []);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  const handleStart = () => {
    setTimeLeft(30 * 60); // 30분
    setTimerRunning(true);
  };

  const handleChange = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = (auto = false) => {
    setTimerRunning(false);
    let newScore = 0;

    quizData.questions.forEach((q, i) => {
      const userAnswer = (answers[i] || "").trim();
      const correct = q.answer.trim();
      if (userAnswer === correct) newScore++;
    });

    setScore(newScore);
    setSubmitted(true);
  };

  const formatTime = () => {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const s = String(timeLeft % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!quizData) return <p>로딩 중...</p>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 지니위키 시험지</h1>

        {!timerRunning && !submitted && (
          <div className="set-timer">
            <label className="s-title" htmlFor="timeInput">
              시간 설정 :{" "}
            </label>
            <input id="timeInput" type="number" readOnly value={30} /> 분
            <button onClick={handleStart}>타이머 시작</button>
          </div>
        )}

        {(timerRunning || submitted) && (
          <div id="quizSection">
            <div className="timer-div">
              남은 시간: <span id="timer">{formatTime()}</span>
            </div>

            <form className="quiz-form">
              {quizData.questions.map((q, i) => (
                <div key={i} className={`question_${i}`}>
                  <p className="question">
                    Q{i + 1}. {q.text}
                  </p>
                  {q.type === "객관식" &&
                    q.options.map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={idx + 1}
                          onChange={(e) => handleChange(i, e.target.value)}
                          disabled={submitted}
                        />{" "}
                        {idx + 1}. {opt}
                      </label>
                    ))}
                  {q.type === "OX" && (
                    <>
                      <label>
                        <input
                          type="radio"
                          name={`q${i}`}
                          value="O"
                          onChange={(e) => handleChange(i, e.target.value)}
                          disabled={submitted}
                        />{" "}
                        O
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`q${i}`}
                          value="X"
                          onChange={(e) => handleChange(i, e.target.value)}
                          disabled={submitted}
                        />{" "}
                        X
                      </label>
                    </>
                  )}
                  {q.type === "주관식" && (
                    <input
                      type="text"
                      name={`q${i}`}
                      className="write-answer"
                      placeholder="정답을 입력해주세요."
                      onChange={(e) => handleChange(i, e.target.value)}
                      disabled={submitted}
                    />
                  )}
                </div>
              ))}
            </form>

            {!submitted && (
              <button id="submitBtn" onClick={() => handleSubmit()}>
                제출
              </button>
            )}

            {submitted && (
              <div id="result" className="result">
                <h2>
                  총 점수: {score} / {quizData.questions.length}
                </h2>
                {quizData.questions.map((q, i) => {
                  const correct = q.answer.trim();
                  const user = (answers[i] || "").trim();
                  const isCorrect = user === correct;
                  return (
                    <p key={i}>
                      Q{i + 1}:{" "}
                      {isCorrect ? (
                        <span className="correct">정답입니다!</span>
                      ) : (
                        <span className="incorrect">
                          오답입니다. (정답: {correct}, 입력: {user || "미입력"}
                          )
                        </span>
                      )}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
