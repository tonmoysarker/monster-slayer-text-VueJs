function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
    data() {
        return {
            monsterHealth: 100,
            playerHealth: 100,
            battleLogs: [],
            round: 0,
            isGameOver: false,
            playerWins: false,
            monsterWins: false,
            gameDraw: false,
        };
    },
    computed: {
        monsterHealthBar() {
            return `width: ${this.monsterHealth}%`;
        },

        playerHealthBar() {
            return `width: ${this.playerHealth}%`;
        },
        specialCharged() {
            return this.round != 0 && this.round % 3 === 0;
        },
        healAvailable() {
            return this.playerHealth < 100;
        },
    },

    methods: {
        startGame() {
            this.monsterHealth = 100;
            this.playerHealth = 100;
            this.battleLogs = [];
            this.round = 0;
            this.isGameOver = false;
            this.playerWins = false;
            this.monsterWins = false;
            this.gameDraw = false;
        },
        playerNormalAtk() {
            this.round++;
            const atkValue = getRandomValue(5, 13);
            if (this.monsterHealth - atkValue < 0) {
                this.monsterHealth = 0;
                return;
            } else {
                this.monsterHealth -= atkValue;
            }
            this.battleLogs.unshift(
                `Player dealt ${atkValue} damage to Monster`
            );
            this.monsterAtk();
        },
        monsterAtk() {
            const atkValue = getRandomValue(6, 18);

            if (this.playerHealth - atkValue < 0) {
                this.playerHealth = 0;
            } else {
                this.playerHealth -= atkValue;
            }
            this.battleLogs.unshift(
                `Monster dealt ${atkValue} damage to Player`
            );
        },
        playerSpecialAtk() {
            this.round = 0;
            const atkValue = getRandomValue(10, 25);

            if (this.monsterHealth - atkValue < 0) {
                this.monsterHealth = 0;
            } else {
                this.monsterHealth -= atkValue;
            }

            this.battleLogs.unshift(
                `Player dealt ${atkValue} damage to Monster using Special Attack`
            );
            this.monsterAtk();
        },
        healPlayer() {
            this.round++;

            const healValue = getRandomValue(5, 15);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }

            this.battleLogs.unshift(`Player healed with ${healValue} health`);
            this.monsterAtk();
        },

        playerSurrender() {
            this.isGameOver = true;
            this.monsterWins = true;
            this.battleLogs.unshift(`Player surrendered`);
        },
    },

    watch: {
        monsterHealth: {
            handler(newValue) {
                if (newValue <= 0 && this.playerHealth <= 0) {
                    //draw
                    this.isGameOver = true;
                    this.gameDraw = true;
                } else if (newValue <= 0) {
                    //player wins
                    this.isGameOver = true;
                    this.playerWins = true;
                }
            },
        },
        playerHealth: {
            handler(newValue) {
                if (newValue <= 0 && this.monsterHealth <= 0) {
                    //draw
                    this.isGameOver = true;
                    this.gameDraw = true;
                } else if (newValue <= 0) {
                    //monster wins
                    this.isGameOver = true;
                    this.monsterWins = true;
                }
            },
        },
    },
});

app.mount("#game");
