import React, { useState } from 'react'
import { useEffect } from 'react'

import styles from '../styles/Quizes.module.scss'

import quizes from './Questions.json'

export function Quizes() {
  const [currentQuestionIndex, addIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [explanationVisible, setExplanationVisibility] = useState(false)
  const [summaryVisible, setSummaryVisibility] = useState(false)
  const [chosenQuiz, setChosenQuiz] = useState('marsQuestions')
  const [showQuizSelection, setShowQuizSelection] = useState(true)

  function choseQuiz(quiz) {
    setChosenQuiz(quiz)
    setShowQuizSelection(false)
    console.log(chosenQuiz)
  }

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
    setShowQuizSelection(true)
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
    <div className={styles['main-container']}>
      {showQuizSelection && (
        <div>
          <h1>Choose the Quiz</h1>
          <div>
            <button onClick={() => choseQuiz('marsQuestions')}>Mars Quiz</button>
            <button onClick={() => choseQuiz('solarQuestions')}>Solar System Quiz</button>
            <button onClick={() => choseQuiz('vehicleQuestions')}>NASA Vehicles Quiz</button>
          </div>
        </div>
      )}
      <h1>Question {currentQuestionIndex + 1}/10</h1>
      {currentQuestionIndex < 10 && (
        <div className={styles['question-box']}>
          <h3>{quizes[chosenQuiz][currentQuestionIndex].question}</h3>
          {explanationVisible && <h4>Explanation to the question</h4>}
          <div className={styles['answer-buttons']}>
            {quizes.marsQuestions[currentQuestionIndex].answers.map((elem) => (
              <button onClick={() => answerChosen(elem.isTrue)}>{elem.answer}</button>
            ))}
          </div>
        </div>
      )}
      <button
        className={styles['next-question-btn']}
        onClick={() => {
          toggleNextQuestion()
        }}
      >
        Next question
      </button>
      {summaryVisible && (
        <div className={styles['question-box']}>
          <h3>Congrats you answered correctly {score} out of 10 questions!</h3>
          <button
            className={styles['next-question-btn']}
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
