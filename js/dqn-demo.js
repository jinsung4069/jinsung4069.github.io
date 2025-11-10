/**
 * DQN GridWorld Demo
 * Reinforcement Learning demonstration using Q-Learning algorithm
 */

// Configuration constants
const CONFIG = {
    GRID_SIZE: 10,
    OBSTACLE_COUNT: 15,
    MAX_STEPS: 100,
    EPISODE_DELAY_MS: 500,

    // Rewards
    REWARDS: {
        GOAL: 10,
        STEP: -0.1,
        COLLISION: -1
    },

    // Rendering
    CELL_PADDING: 2,
    AGENT_RADIUS_RATIO: 1 / 3,

    // Colors
    COLORS: {
        GRID: '#ddd',
        OBSTACLE: '#666',
        GOAL: '#28a745',
        AGENT: '#000'
    },

    // Initial positions
    START_POS: { x: 0, y: 0 },
    GOAL_POS: { x: 9, y: 9 }
};

// Direction vectors (shared constant)
const DIRECTIONS = [
    { dx: 0, dy: -1, action: 0 }, // up
    { dx: 1, dy: 0, action: 1 },  // right
    { dx: 0, dy: 1, action: 2 },  // down
    { dx: -1, dy: 0, action: 3 }  // left
];

class DQNDemo {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = CONFIG.GRID_SIZE;
        this.cellSize = this.canvas.width / this.gridSize;

        this.agentPosition = { ...CONFIG.START_POS };
        this.goalPosition = { ...CONFIG.GOAL_POS };
        this.obstacles = this.generateObstacles();

        this.qTable = this.initializeQTable();
        this.episode = 0;
        this.totalReward = 0;
        this.rewardHistory = [];
        this.successCount = 0;

        this.isRunning = false;
        this.animationId = null;

        this.initializeControls();
        this.render();
    }

    generateObstacles() {
        const obstacles = [];
        for (let i = 0; i < CONFIG.OBSTACLE_COUNT; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.gridSize);
                y = Math.floor(Math.random() * this.gridSize);
            } while (
                (x === CONFIG.START_POS.x && y === CONFIG.START_POS.y) ||
                (x === CONFIG.GOAL_POS.x && y === CONFIG.GOAL_POS.y)
            );
            obstacles.push({ x, y });
        }
        return obstacles;
    }

    initializeQTable() {
        const table = {};
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                table[`${x},${y}`] = [0, 0, 0, 0]; // up, right, down, left
            }
        }
        return table;
    }

    initializeControls() {
        // Unified button handlers (no duplication for Korean/English)
        const buttonMappings = [
            { selectors: ['startBtn', 'startBtnEn'], handler: () => this.start() },
            { selectors: ['pauseBtn', 'pauseBtnEn'], handler: () => this.pause() },
            { selectors: ['resetBtn', 'resetBtnEn'], handler: () => this.reset() }
        ];

        buttonMappings.forEach(({ selectors, handler }) => {
            selectors.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.onclick = handler;
                }
            });
        });

        // Slider handlers
        const sliderMappings = [
            { id: 'learningRate', displayId: 'learningRateValue' },
            { id: 'epsilon', displayId: 'epsilonValue' },
            { id: 'discountFactor', displayId: 'discountFactorValue' }
        ];

        sliderMappings.forEach(({ id, displayId }) => {
            const slider = document.getElementById(id);
            const display = document.getElementById(displayId);
            if (slider && display) {
                slider.oninput = (e) => {
                    display.textContent = e.target.value;
                };
            }
        });
    }

    start() {
        this.isRunning = true;
        this.updateButtonStates();
        this.runEpisode();
    }

    pause() {
        this.isRunning = false;
        this.updateButtonStates();
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
    }

    reset() {
        this.pause();
        this.agentPosition = { ...CONFIG.START_POS };
        this.episode = 0;
        this.totalReward = 0;
        this.rewardHistory = [];
        this.successCount = 0;
        this.qTable = this.initializeQTable();
        this.obstacles = this.generateObstacles();
        this.updateStats();
        this.render();
    }

    updateButtonStates() {
        const startButtons = ['startBtn', 'startBtnEn'];
        const pauseButtons = ['pauseBtn', 'pauseBtnEn'];

        startButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = this.isRunning;
        });

        pauseButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = !this.isRunning;
        });
    }

    getState(pos) {
        return `${pos.x},${pos.y}`;
    }

    getValidActions(pos) {
        const actions = [];

        DIRECTIONS.forEach(dir => {
            const newX = pos.x + dir.dx;
            const newY = pos.y + dir.dy;

            if (newX >= 0 && newX < this.gridSize &&
                newY >= 0 && newY < this.gridSize &&
                !this.obstacles.some(obs => obs.x === newX && obs.y === newY)) {
                actions.push(dir.action);
            }
        });

        return actions;
    }

    chooseAction(state) {
        const epsilon = parseFloat(document.getElementById('epsilon').value);
        const validActions = this.getValidActions(this.agentPosition);

        if (Math.random() < epsilon) {
            return validActions[Math.floor(Math.random() * validActions.length)];
        }

        const qValues = this.qTable[state];
        let bestAction = 0;
        let bestValue = -Infinity;

        validActions.forEach(action => {
            if (qValues[action] > bestValue) {
                bestValue = qValues[action];
                bestAction = action;
            }
        });

        return bestAction;
    }

    takeAction(action) {
        const dir = DIRECTIONS[action];
        const newPos = {
            x: Math.max(0, Math.min(this.gridSize - 1, this.agentPosition.x + dir.dx)),
            y: Math.max(0, Math.min(this.gridSize - 1, this.agentPosition.y + dir.dy))
        };

        if (this.obstacles.some(obs => obs.x === newPos.x && obs.y === newPos.y)) {
            return { newPos: this.agentPosition, reward: CONFIG.REWARDS.COLLISION, done: false };
        }

        let reward = CONFIG.REWARDS.STEP;
        let done = false;

        if (newPos.x === this.goalPosition.x && newPos.y === this.goalPosition.y) {
            reward = CONFIG.REWARDS.GOAL;
            done = true;
        }

        return { newPos, reward, done };
    }

    updateQValue(state, action, reward, nextState, done) {
        const learningRate = parseFloat(document.getElementById('learningRate').value);
        const discountFactor = parseFloat(document.getElementById('discountFactor').value);

        const currentQ = this.qTable[state][action];
        let maxNextQ = 0;

        if (!done) {
            maxNextQ = Math.max(...this.qTable[nextState]);
        }

        const newQ = currentQ + learningRate * (reward + discountFactor * maxNextQ - currentQ);
        this.qTable[state][action] = newQ;
    }

    async runEpisode() {
        if (!this.isRunning) return;

        this.agentPosition = { ...CONFIG.START_POS };
        let episodeReward = 0;
        let steps = 0;

        while (this.isRunning && steps < CONFIG.MAX_STEPS) {
            const state = this.getState(this.agentPosition);
            const action = this.chooseAction(state);
            const { newPos, reward, done } = this.takeAction(action);

            const nextState = this.getState(newPos);
            this.updateQValue(state, action, reward, nextState, done);

            this.agentPosition = newPos;
            episodeReward += reward;
            steps++;

            this.render();

            if (done) {
                this.successCount++;
                break;
            }

            const speed = parseInt(document.getElementById('speed').value);
            await new Promise(resolve => {
                this.animationId = setTimeout(resolve, speed);
            });
        }

        this.episode++;
        this.totalReward += episodeReward;
        this.rewardHistory.push(episodeReward);
        this.updateStats();

        if (this.isRunning) {
            setTimeout(() => this.runEpisode(), CONFIG.EPISODE_DELAY_MS);
        }
    }

    updateStats() {
        document.getElementById('episode').textContent = this.episode;
        document.getElementById('totalReward').textContent = this.totalReward.toFixed(1);

        if (this.rewardHistory.length > 0) {
            const avgReward = this.rewardHistory.reduce((a, b) => a + b, 0) / this.rewardHistory.length;
            document.getElementById('avgReward').textContent = avgReward.toFixed(1);
        }

        const successRate = this.episode > 0 ? (this.successCount / this.episode * 100).toFixed(1) : 0;
        document.getElementById('successRate').textContent = successRate + '%';
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderGrid();
        this.renderObstacles();
        this.renderGoal();
        this.renderAgent();
    }

    renderGrid() {
        this.ctx.strokeStyle = CONFIG.COLORS.GRID;
        for (let i = 0; i <= this.gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
    }

    renderObstacles() {
        this.ctx.fillStyle = CONFIG.COLORS.OBSTACLE;
        this.obstacles.forEach(obs => {
            this.ctx.fillRect(
                obs.x * this.cellSize + CONFIG.CELL_PADDING,
                obs.y * this.cellSize + CONFIG.CELL_PADDING,
                this.cellSize - CONFIG.CELL_PADDING * 2,
                this.cellSize - CONFIG.CELL_PADDING * 2
            );
        });
    }

    renderGoal() {
        this.ctx.fillStyle = CONFIG.COLORS.GOAL;
        this.ctx.fillRect(
            this.goalPosition.x * this.cellSize + CONFIG.CELL_PADDING,
            this.goalPosition.y * this.cellSize + CONFIG.CELL_PADDING,
            this.cellSize - CONFIG.CELL_PADDING * 2,
            this.cellSize - CONFIG.CELL_PADDING * 2
        );
    }

    renderAgent() {
        this.ctx.fillStyle = CONFIG.COLORS.AGENT;
        this.ctx.beginPath();
        this.ctx.arc(
            this.agentPosition.x * this.cellSize + this.cellSize / 2,
            this.agentPosition.y * this.cellSize + this.cellSize / 2,
            this.cellSize * CONFIG.AGENT_RADIUS_RATIO,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }
}

window.addEventListener('load', () => {
    new DQNDemo();
});
