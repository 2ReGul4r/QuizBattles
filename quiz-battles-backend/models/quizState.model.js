import mongoose from "mongoose";
const Schema = mongoose.Schema;

const quizStateQuestionSchema = new Schema({
    hasPicture: {
        type: Boolean,
        default: false
    },
    hasAaudio: {
        type: Boolean,
        default: false
    },
    worth: {
        type: Number,
        required: true
    },
    questionType: {
        type: String,
        enum: ["buzzer", "guess", "choice"],
        required: true
    },
    isLockedForCount: {
        type: Number,
        default: 0,
        min: 0
    }
});

const quizStateCategorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    questions: [questionSchema],
});

const quizStateShopRerollSchema = new Schema({
    enabled: {
        type: Boolean,
        default: true
    },
    global: {
        type: Boolean,
        default: false
    },
    count: {
        type: Number,
        default: 1,
        min: 0
    },
    costs: {
        type: Number,
        default: 50,
        min: 1
    },
    costIncrease: {
        type: Number,
        default: 0,
        min: 0
    }
});

const quizStateShopUpgradeSchema = new Schema({
    enabled: {
        type: Boolean,
        default: true
    },
    global: {
        type: Boolean,
        default: false
    },
    count: {
        type: Number,
        default: 1,
        min: 1
    },
    costPerRarity: {
        common: {
            type: Number,
            default: 15,
            min: 1
        },
        uncommon: {
            type: Number,
            default: 30,
            min: 1
        },
        rare: {
            type: Number,
            default: 60,
            min: 1
        },
        epic: {
            type: Number,
            default: 100,
            min: 1
        }
    },
    costIncrease: {
        type: Number,
        default: 1,
        min: 0
    }
});

const quizStateRarityChancesSchema = new Schema({
    common: {
        type: Number,
        default: 40
    },
    uncommon: {
        type: Number,
        default: 30
    },
    rare: {
        type: Number,
        default: 15
    },
    epic: {
        type: Number,
        default: 10
    },
    legendary: {
        type: Number,
        default: 5
    }
});

const quizStateSchema = new Schema({
    categories: [categorySchema],
    options: {
        quiz: {
            questionsPreCategory: {
                type: Number,
                default: 5
            },
            categoryCount: {
                type: Number,
                default: 6
            },
            buzzerAnswerTimer: {
                type: Number,
                default: 20
            },
            multiBuzzer: {
                type: Boolean,
                default: false
            },
        },
        battle: {
            enabled: {
                type: Boolean,
                default: true
            },
            betweenShop: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                reroll: quizStateShopRerollSchema,
                upgrade: quizStateShopUpgradeSchema,
                rarities: quizStateRarityChancesSchema,
                intervalCount: {
                    type: Number,
                    default: 5
                },
                itemCount: {
                    type: Number,
                    default: 3
                },
                guaranteedSigil: {
                    type: Boolean,
                    default: false
                }
            },
            endShop: {
                enabled: {
                    type: Boolean,
                    default: true
                },
                reroll: quizStateShopRerollSchema,
                upgrade: quizStateShopUpgradeSchema,
                rarities: quizStateRarityChancesSchema,
                itemCount: {
                    type: Number,
                    default: 10
                },
                guaranteedSigil: {
                    type: Boolean,
                    default: true
                }
            }
        }
    }
});

const QuizState = mongoose.model("QuizState", quizStateSchema);

export default QuizState;
