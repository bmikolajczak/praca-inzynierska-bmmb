import React, { useState } from 'react'
import { useEffect } from 'react'

import quizes from './Questions.json'

export function Quizes() {
  const [currentQuestionIndex, addIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [explanationVisible, setExplanationVisibility] = useState(false)
  const [summaryVisible, setSummaryVisibility] = useState(false)

  function toggleNextQuestion() {
    if (currentQuestionIndex < 9) {
      addIndex(currentQuestionIndex + 1)
      setExplanationVisibility(false)
    } else {
      setExplanationVisibility(true)
      setSummaryVisibility(true)
    }
  }
  function retryQuiz() {
    addIndex(0)
    setScore(0)
    setExplanationVisibility(false)
    setSummaryVisibility(false)
  }

  function answerChosen(answer) {
    if (answer) {
      setScore(score + 1)
      setExplanationVisibility(true)
    } else {
      setExplanationVisibility(true)
    }
  }
  useEffect(() => console.log(currentQuestionIndex), [currentQuestionIndex])
  return (
    <div>
      <h1>Welcome to quizes page!</h1>
      <button
        onClick={() => {
          toggleNextQuestion()
        }}
      >
        Next Question
      </button>
      <p>Score: {score}</p>
      {currentQuestionIndex < 10 && (
        <div>
          <h3>{quizes.marsQuestions[currentQuestionIndex].question}</h3>
          {explanationVisible && <h4>Explanation to the question</h4>}
          <div>
            {quizes.marsQuestions[currentQuestionIndex].answers.map((elem) => (
              <button onClick={() => answerChosen(elem.isTrue)}>{elem.answer}</button>
            ))}
          </div>
        </div>
      )}
      {summaryVisible && (
        <div>
          <h1>Congrats you answered correctly {score} out of 10 questions!</h1>
          <button
            onClick={() => {
              retryQuiz()
            }}
          >
            Retry?
          </button>
        </div>
      )}
    </div>
  )
}
