import { createQuizBattle, saveQuizBattle, readQuizBattle } from "../services/quizbattles.service.jsx";
import React, { createContext, useReducer, useEffect, useRef } from "react";

// Initial state basierend auf dem Schema
const initialState = {};

// Reducer zum Verarbeiten von Actions
function quizBattleReducer(state, action) {
  switch (action.type) {
    case "SET_INITAL_STATE":
      return {
        ...action.payload
      };
    case "SET_QUIZBATTLE_ID":
      return {
        _id: action.payload,
        ...state
      };
    case "SET_OWNER":
      return { ...state, owner: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_CATEGORY_COUNT":
      if (state.categories.length >= action.payload) {
        return {
          ...state,
          options: {
            ...state.options,
            quiz: {
              ...state.options.quiz,
              categoryCount: action.payload
            }
          }
        }
      }
      const emptyCategory = {title: "", questions: []};
      const missingCategories = parseInt(action.payload - state.categories.length);
      const updatedCategories = state.categories;
      Array(missingCategories).keys().forEach((i) => {
        updatedCategories.push(emptyCategory);
      });
      return {
        ...state,
        categories: updatedCategories,
        options: {
          ...state.options,
          quiz: {
            ...state.options.quiz,
            categoryCount: action.payload
          }
        }
      };
    case "RENAME_CATEGORY":
      const categoryUpdate = state.categories;
      categoryUpdate[action.categoryIndex] = { ...state.categories[action.categoryIndex], title: action.payload }
      return {
        ...state,
        categories: [
          ...categoryUpdate
        ]
      };
    case "ADD_QUESTION":
      const categoryToUpdate = { ...state.categories[action.categoryIndex] };
      const questionsUpdate = [...(categoryToUpdate.questions || [])];
      questionsUpdate[action.questionIndex] = action.payload;
      categoryToUpdate.questions = questionsUpdate;
      const categoriesUpdate = [...state.categories];
      categoriesUpdate[action.categoryIndex] = categoryToUpdate;
      return {
        ...state,
        categories: categoriesUpdate
      };
    case "UPDATE_QUIZ_OPTION":
      return { 
        ...state, 
        options: {
          ...state.options,
          quiz: {
            ...state.options.quiz,
            [action.option]: action.payload
          }
        }
      };
    case "UPDATE_BATTLE_OPTION":
      return { 
        ...state, 
        options: {
          ...state.options,
          battle: {
            ...state.options.battle,
            [action.option]: action.payload
          }
        }
      };
    case "UPDATE_GENERAL_SHOP_OPTION":
      return { 
        ...state, 
        options: {
          ...state.options,
          battle: {
            ...state.options.battle,
            betweenShop: {
              ...state.options.battle.betweenShop,
              [action.option]: action.payload
            }
          }
        }
      };
    case "UPDATE_ENDGAME_SHOP_OPTION":
      return { 
        ...state, 
        options: {
          ...state.options,
          battle: {
            ...state.options.battle,
            endShop: {
              ...state.options.battle.endShop,
              [action.option]: action.payload
            }
          }
        }
      };
    case "UPDATE_DEEP_SHOP_OPTIONS":
      return {
        ...state,
        options: {
          ...state.options,
          battle: {
            ...state.options.battle,
            [action.shop]: {
              ...state.options.battle[action.shop],
              [action.nested]: {
                ...state.options.battle[action.shop][action.nested],
                [action.option]: action.payload
              }
            }
          }
        }
      };
    case "UPDATE_SHOP_UPGRADE_RARITY_COSTS":
      return {
        ...state,
        options: {
          ...state.options,
          battle: {
            ...state.options.battle,
            [action.shop]: {
              ...state.options.battle[action.shop],
              upgrade: {
                ...state.options.battle[action.shop].upgrade,
                costPerRarity: {
                  ...state.options.battle[action.shop].upgrade.costPerRarity,
                  [action.rarity]: action.payload
                }
              }
            }
          }
        }
      };
    default:
      return state;
  }
};

// Context erstellen
const QuizBattleContext = createContext();

// Provider Komponente
const QuizBattleProvider = ({ children, initialQuizBattleID }) => {
  const [state, dispatch] = useReducer(quizBattleReducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Initialer useEffect, der beim ersten Laden ausgeführt wird
  useEffect(() => {
    if (!initialQuizBattleID) {
      const initialSetup = async () => {
        const response = await createQuizBattle();
        dispatch({ type: "SET_INITAL_STATE", payload: response });
        dispatch({ type: "SET_CATEGORY_COUNT", payload: 6 });
      };
      initialSetup();
    } else {
      const initQuizBattle = async () => {
        const response = await readQuizBattle(initialQuizBattleID);
        dispatch({ type: "SET_INITAL_STATE", payload: response });
      }
      initQuizBattle();
    }

    return () => {
      if (stateRef.current._id) {
        saveQuizBattle(stateRef.current);
      }
    }
  }, []);

  return (
    <QuizBattleContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizBattleContext.Provider>
  );
};

export { QuizBattleContext, QuizBattleProvider };
