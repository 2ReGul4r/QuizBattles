import mongoose from "mongoose";
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    text: String,
    picture: [String],
    audio: [String]
}, { _id: false });

const questionSchema = new Schema({
    question: String,
    isAnswered: {
        type: Boolean,
        default: false
    },
    answeredFrom: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    answer: answerSchema,
    picture: [String],
    audio: [String],
    worth: {
        type: Number,
        default: 500
    },
    questionType: {
        type: String,
        enum: ["buzzer", "guess"],
        default: "buzzer"
    },
    isLockedForCount: {
        type: Number,
        default: 0,
        min: 0
    }
}, { _id: false });

const categorySchema = new Schema({
    title: {
        type: String,
    },
    questions: [questionSchema],
}, { _id: false });

const rarityChancesSchema = new Schema({
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
}, { _id: false });

const quizBattleSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        default: "NewQuiz"
    },
    categories: [categorySchema],
    options: {
        money: {
            starting: {
                type: Number,
                default: 2000
            },
            gainPerRound: {
                type: Number,
                default: 200
            },
            lossOnWrongAnswer: {
                type: Number,
                default: 0.5
            }
        },
        quiz: {
            questionsPerCategory: {
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
                reroll: {
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
                },
                upgrade: {
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
                    dynamicCosts: {
                        type: Boolean,
                        default: true
                    },
                    costs: {
                        type: Number,
                        default: 250
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
                        default: 0,
                        min: 0
                    }
                },
                rarities: rarityChancesSchema,
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
                reroll: {
                    enabled: {
                        type: Boolean,
                        default: true
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
                },
                upgrade: {
                    enabled: {
                        type: Boolean,
                        default: true
                    },
                    count: {
                        type: Number,
                        default: 1,
                        min: 1
                    },
                    dynamicCosts: {
                        type: Boolean,
                        default: true
                    },
                    costs: {
                        type: Number,
                        default: 250
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
                        default: 0,
                        min: 0
                    }
                },
                rarities: rarityChancesSchema,
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
}, { timestamps: true });

const QuizBattle = mongoose.model("QuizBattle", quizBattleSchema);

export default QuizBattle;
