import React, { createContext, useContext, useState } from 'react';

const CreateQuizBattleStateContext = createContext();

export const CreateQuizBattleStateProvider = ({ children }) => {
  const [state, setState] = useState({});
  
  return (
    <CreateQuizBattleStateContext.Provider value={{ state, setState }}>
      {children}
    </CreateQuizBattleStateContext.Provider>
  );
};

export const useCreateQuizBattle = () => useContext(CreateQuizBattleStateContext);