import React, { useState } from 'react'
import { useEffect } from 'react'

import { updateDoc, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../../infrastructure/firebase/firebase'

import styles from '../styles/Quizes.module.scss'

import quizes from './Questions.json'

export function Quizes() {
  const [currentQuestionIndex, addIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [explanationVisible, setExplanationVisibility] = useState(false)
  const [summaryVisible, setSummaryVisibility] = useState(false)
  const [chosenQuiz, setChosenQuiz] = useState('marsQuestions')
  const [showQuizSelection, setShowQuizSelection] = useState(true)
  const [quizVisible, setQuizVisible] = useState(false)
  const [answerCorrect, setAnswerCorrect] = useState(true)
  const [quizesFirestore, setQuizesFirestore] = useState({})

  //quuestions ref
  const questionsRef = doc(db, 'quizes', 'questions')

  function choseQuiz(quiz) {
    setChosenQuiz(quiz)
    setShowQuizSelection(false)
    setQuizVisible(true)
    // console.log(chosenQuiz)
  }

  async function toggleNextQuestion() {
    if (currentQuestionIndex < 9) {
      addIndex(currentQuestionIndex + 1)
      setExplanationVisibility(false)
      setQuizVisible(true)
    } else {
      setExplanationVisibility(true)
      setSummaryVisibility(true)
      setQuizVisible(false)
      try {
        //user ref
        const currentUserRef = doc(db, 'users', auth.currentUser.uid)

        if (chosenQuiz === 'marsQuestions') {
          await updateDoc(currentUserRef, { marsQuiz: `${score}/10` })
        } else if (chosenQuiz === 'solarQuestionss') {
          await updateDoc(currentUserRef, { solarQuiz: `${score}/10` })
        } else if (chosenQuiz === 'vehicleQuestions') {
          await updateDoc(currentUserRef, { vehicleQuiz: `${score}/10` })
        }
      } catch (error) {
        console.log('Error when upadting quiz score', error)
      }
    }
  }
  function retryQuiz() {
    addIndex(0)
    setScore(0)
    setExplanationVisibility(false)
    setSummaryVisibility(false)
    setQuizVisible(false)
    setShowQuizSelection(true)
  }

  function answerChosen(answer) {
    if (answer) {
      setScore(score + 1)
      setExplanationVisibility(true)
      setQuizVisible(false)
      setAnswerCorrect(true)
    } else {
      setExplanationVisibility(true)
      setAnswerCorrect(false)
      setQuizVisible(false)
    }
    // console.log('quizes', quizesFirestore)
  }
  async function getQuestions() {
    const questionsSnapshot = await getDoc(questionsRef)
    if (questionsSnapshot.exists()) {
      setQuizesFirestore(questionsSnapshot.data())
    }
  }

  useEffect(() => {
    getQuestions()
  }, [])

  useEffect(() => console.log(currentQuestionIndex), [currentQuestionIndex])
  return (
    <div className={styles['main-container']}>
      {showQuizSelection && (
        <div className={styles['quiz-choice']}>
          <h1>Choose the Quiz</h1>
          <div className={styles['choice-buttons']}>
            <button className={styles['choice-button']} onClick={() => choseQuiz('marsQuestions')}>
              Mars Quiz
            </button>
            <button className={styles['choice-button']} onClick={() => choseQuiz('solarQuestions')}>
              Solar System Quiz
            </button>
            <button className={styles['choice-button']} onClick={() => choseQuiz('vehicleQuestions')}>
              NASA Missions Quiz
            </button>
          </div>
        </div>
      )}
      {(quizVisible || explanationVisible) && <h1>Question {currentQuestionIndex + 1}/10</h1>}
      {quizVisible && (
        <div className={styles['quiz-box']}>
          {currentQuestionIndex < 10 && (
            <div className={styles['question-box']}>
              <h3>{quizesFirestore[chosenQuiz][currentQuestionIndex].question}</h3>
              <div className={styles['answer-buttons']}>
                {quizesFirestore[chosenQuiz][currentQuestionIndex].answers.map((elem) => (
                  <button onClick={() => answerChosen(elem.isTrue)}>{elem.answer}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {explanationVisible && (
        <div className={styles['quiz-box']}>
          <h4 className={answerCorrect ? styles['correct'] : styles['incorrect']}>
            {quizes[chosenQuiz][currentQuestionIndex].explanation}
          </h4>
          <button
            className={styles['next-question-btn']}
            onClick={() => {
              toggleNextQuestion()
            }}
          >
            Next question
          </button>{' '}
        </div>
      )}

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
