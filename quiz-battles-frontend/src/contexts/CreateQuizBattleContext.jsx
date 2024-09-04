import quizBattle from "../defaultQuizBattle";
import toast from "react-hot-toast";
import { saveBoard } from "../services/board.service.jsx";
import React, { createContext, useReducer, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Initial state basierend auf dem Schema
const initialState = quizBattle;

// Reducer zum Verarbeiten von Actions
function quizBattleReducer(state, action) {
  switch (action.type) {
    case "SET_QUIZBATTLE_ID":
      return {
        _id: action.payload,
        ...state
      }
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
      const questionsUpdate = state.categories[action.categoryIndex]?.questions || [];
      questionsUpdate[action.questionIndex] = action.payload;
      const categoriesUpdate = state.categories;
      categoriesUpdate[action.categoryIndex] = categoriesUpdate[action.categoryIndex] || {};
      categoriesUpdate[action.categoryIndex].questions = questionsUpdate;
      return {
        ...state,
        categories: [
          ...categoriesUpdate
        ]
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
const QuizBattleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizBattleReducer, initialState);

  // Effekt, um State-Änderungen an den Server zu senden
  useEffect(() => {
    const sendStateToServer = async () => {
      try {
        const token = Cookies.get("userjwt");
        const decodedToken = jwtDecode(token);
        const { userID, email, isAdmin, username } = decodedToken;

        console.log('getting here', userID);

        // Dispatch und warte auf das Update
        dispatch({ type: "SET_OWNER", payload: userID });

        // Warte einen nächsten Frame-Zyklus ab, um sicherzustellen, dass der State aktualisiert wurde
        await new Promise(resolve => setTimeout(resolve, 0));

        console.log('here', state);

        // Speichere den aktualisierten state auf dem Server
        const response = await saveBoard(state);

        console.log(response);

        // Verarbeite die Serverantwort
        if (response._id) {
          dispatch({ type: "SET_QUIZBATTLE_ID", payload: response._id });
        }

        return response;
      } catch (error) {
        if (error?.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Something went wrong, please try again later.");
        }
      }
    };

    // Direkt den Zustand auf den Server senden
    sendStateToServer();

    // Cleanup-Funktion (falls notwendig)
    return () => {
      sendStateToServer();
    };
  }, []); // Hier solltest du dispatch und state als Abhängigkeiten hinzufügen

  return (
    <QuizBattleContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizBattleContext.Provider>
  );
};

export { QuizBattleContext, QuizBattleProvider };
