import mongoose from "mongoose";
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: String,
    answer: {
        type: String,
        required: true
    },
    picture: {
        data: Buffer, 
        contentType: String
    },
    audio: {
        data: Buffer,
        contentType: String
    },
    worth: {
        type: Number,
        required: true
    },
    questionType: {
        type: String,
        enum: ["buzzer", "guess"],
        required: true
    },
    isLockedForCount: {
        type: Number,
        default: 0,
        min: 0,
    }
});

const categoriesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    questions: [questionSchema],
});

const shopRerollSchema = new Schema({
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

const shopUpgradeSchema = new Schema({
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
        },
    },
    costIncrease: {
        type: Number,
        default: 1,
        min: 0
    }
});

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
    },
});

const boardSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    categories: [categoriesSchema],
    options: {
        buzzerAnswerTimer: {
            type: Number,
            default: 20
        },
        multiBuzzer: {
            type: Boolean,
            default: false
        },
        betweenShop: {
            enabled: {
                type: Boolean,
                default: true
            },
            reroll: shopRerollSchema,
            upgrade: shopUpgradeSchema,
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
            reroll: shopRerollSchema,
            upgrade: shopUpgradeSchema,
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
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
