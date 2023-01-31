import { configureStore, combineReducers } from '@reduxjs/toolkit'

import app from './appState'

const rootReducer = combineReducers({
  app: app,
})

export const store = configureStore({
  reducer: rootReducer,
})
