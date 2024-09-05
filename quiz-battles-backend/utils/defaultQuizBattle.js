export default {
    owner: "",
    name: "NewQuiz",
    categories: [],
    options: {
        money: {
            starting: 2000,
            gainPerRound: 200,
            lossOnWrongAnswer: 0.5
        },
        quiz: {
            questionsPerCategory: 5,
            categoryCount: 6,
            buzzerAnswerTimer: 20,
            multiBuzzer: false
        },
        battle: {
            enabled: true,
            betweenShop: {
                enabled: true,
                reroll: {
                    enabled: true,
                    global: false,
                    count: 1,
                    costs: 50,
                    costIncrease: 0
                },
                upgrade: {
                    enabled: true,
                    global: false,  
                    count: 1,
                    dynamicCosts: true,
                    costs: 250,
                    costPerRarity: {
                        common: 15,
                        uncommon: 30,
                        rare: 60,
                        epic: 100
                    },
                    costIncrease: 0
                },
                rarities: {
                    common: 40,
                    uncommon: 30,
                    rare: 15,
                    epic: 10,
                    legendary: 5
                },
                intervalCount: 5,
                itemCount: 3,
                guaranteedSigil: false
            },
            endShop: {
                enabled: true,
                reroll: {
                    enabled: true,
                    count: 1,
                    costs: 50,
                    costIncrease: 0
                },
                upgrade: {
                    enabled: false,
                    count: 1,
                    dynamicCosts: true,
                    costs: 250,
                    costPerRarity: {
                        common: 15,
                        uncommon: 30,
                        rare: 60,
                        epic: 100
                    },
                    costIncrease: 0
                },
                rarities: {
                    common: 40,
                    uncommon: 30,
                    rare: 15,
                    epic: 10,
                    legendary: 5
                },
                itemCount: 10,
                guaranteedSigil: true
            }
        }
    }
}
  