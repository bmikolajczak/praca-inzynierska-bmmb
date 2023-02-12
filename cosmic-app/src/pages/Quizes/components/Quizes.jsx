import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

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

  //getting user login state
  const userLoggedIn = useSelector((state) => state.app.userLoggedIn)

  function choseQuiz(quiz) {
    setChosenQuiz(quiz)
    setShowQuizSelection(false)
    setQuizVisible(true)
  }

  async function toggleNextQuestion() {
    if (currentQuestionIndex < 9) {
      addIndex(currentQuestionIndex + 1)
      setExplanationVisibility(false)
      setQuizVisible(true)
    } else {
      setExplanationVisibility(true)
      setQuizVisible(false)
      try {
        if (userLoggedIn) {
          //user ref
          const currentUserRef = doc(db, 'users', auth.currentUser.uid)
          console.log('saving score', currentUserRef)
          if (chosenQuiz === 'marsQuestions') {
            await updateDoc(currentUserRef, { marsQuiz: `${score}/10` })
          } else if (chosenQuiz === 'solarQuestions') {
            await updateDoc(currentUserRef, { solarQuiz: `${score}/10` })
          } else if (chosenQuiz === 'vehicleQuestions') {
            await updateDoc(currentUserRef, { vehicleQuiz: `${score}/10` })
          }
        }
      } catch (error) {
        console.log('Error when upadting quiz score', error)
      }
    }
    if (currentQuestionIndex + 1 === 10) {
      setExplanationVisibility(false)
      setSummaryVisibility(true)
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

  useEffect(() => {}, [currentQuestionIndex])
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
                  <button key={elem.answer} onClick={() => answerChosen(elem.isTrue)}>
                    {elem.answer}
                  </button>
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
            {currentQuestionIndex + 1 === 10 ? 'Show score' : 'Next question'}
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
