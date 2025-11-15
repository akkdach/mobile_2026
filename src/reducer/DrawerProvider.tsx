import React, { createContext, useReducer } from "react"
import TabHomePage from '../pages/MainTabs/TabHomePage'

export const PageContext = createContext({})

const initialState = {
  page: TabHomePage
}

const pageReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SETPAGE":
      return {
        ...state,
        page: action.payload
      }
  }
}

export const DrawerProvider = ({ children }: any) => {
  const [counterState, counterDispatch] = useReducer(
    pageReducer,
    initialState
  )

  const { page } = counterState

  const setPage = (payload: string) => counterDispatch({ type: "SETPAGE", payload });

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  )
}