class DQNDemo {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 10;
        this.cellSize = this.canvas.width / this.gridSize;
        
        this.agent = { x: 0, y: 0 };
        this.goal = { x: 9, y: 9 };
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
        for (let i = 0; i < 15; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.gridSize);
                y = Math.floor(Math.random() * this.gridSize);
            } while ((x === 0 && y === 0) || (x === 9 && y === 9));
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
        document.getElementById('startBtn').onclick = () => this.start();
        document.getElementById('startBtnEn').onclick = () => this.start();
        document.getElementById('pauseBtn').onclick = () => this.pause();
        document.getElementById('pauseBtnEn').onclick = () => this.pause();
        document.getElementById('resetBtn').onclick = () => this.reset();
        document.getElementById('resetBtnEn').onclick = () => this.reset();
        
        const learningRateSlider = document.getElementById('learningRate');
        const epsilonSlider = document.getElementById('epsilon');
        const discountSlider = document.getElementById('discountFactor');
        
        learningRateSlider.oninput = (e) => {
            document.getElementById('learningRateValue').textContent = e.target.value;
        };
        
        epsilonSlider.oninput = (e) => {
            document.getElementById('epsilonValue').textContent = e.target.value;
        };
        
        discountSlider.oninput = (e) => {
            document.getElementById('discountFactorValue').textContent = e.target.value;
        };
    }
    
    start() {
        this.isRunning = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('startBtnEn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('pauseBtnEn').disabled = false;
        this.runEpisode();
    }
    
    pause() {
        this.isRunning = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('startBtnEn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtnEn').disabled = true;
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
    }
    
    reset() {
        this.pause();
        this.agent = { x: 0, y: 0 };
        this.episode = 0;
        this.totalReward = 0;
        this.rewardHistory = [];
        this.successCount = 0;
        this.qTable = this.initializeQTable();
        this.obstacles = this.generateObstacles();
        this.updateStats();
        this.render();
    }
    
    getState(pos) {
        return `${pos.x},${pos.y}`;
    }
    
    getValidActions(pos) {
        const actions = [];
        const directions = [
            { dx: 0, dy: -1, action: 0 }, // up
            { dx: 1, dy: 0, action: 1 },  // right
            { dx: 0, dy: 1, action: 2 },  // down
            { dx: -1, dy: 0, action: 3 }  // left
        ];
        
        directions.forEach(dir => {
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
        const validActions = this.getValidActions(this.agent);
        
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
        const directions = [
            { dx: 0, dy: -1 }, // up
            { dx: 1, dy: 0 },  // right
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }  // left
        ];
        
        const dir = directions[action];
        const newPos = {
            x: Math.max(0, Math.min(this.gridSize - 1, this.agent.x + dir.dx)),
            y: Math.max(0, Math.min(this.gridSize - 1, this.agent.y + dir.dy))
        };
        
        if (this.obstacles.some(obs => obs.x === newPos.x && obs.y === newPos.y)) {
            return { newPos: this.agent, reward: -1, done: false };
        }
        
        let reward = -0.1;
        let done = false;
        
        if (newPos.x === this.goal.x && newPos.y === this.goal.y) {
            reward = 10;
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
        
        this.agent = { x: 0, y: 0 };
        let episodeReward = 0;
        let steps = 0;
        const maxSteps = 100;
        
        while (this.isRunning && steps < maxSteps) {
            const state = this.getState(this.agent);
            const action = this.chooseAction(state);
            const { newPos, reward, done } = this.takeAction(action);
            
            const nextState = this.getState(newPos);
            this.updateQValue(state, action, reward, nextState, done);
            
            this.agent = newPos;
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
            setTimeout(() => this.runEpisode(), 500);
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
        
        this.ctx.strokeStyle = '#ddd';
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
        
        this.ctx.fillStyle = '#666';
        this.obstacles.forEach(obs => {
            this.ctx.fillRect(
                obs.x * this.cellSize + 2,
                obs.y * this.cellSize + 2,
                this.cellSize - 4,
                this.cellSize - 4
            );
        });
        
        this.ctx.fillStyle = '#28a745';
        this.ctx.fillRect(
            this.goal.x * this.cellSize + 2,
            this.goal.y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
        
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(
            this.agent.x * this.cellSize + this.cellSize / 2,
            this.agent.y * this.cellSize + this.cellSize / 2,
            this.cellSize / 3,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }
}

window.addEventListener('load', () => {
    new DQNDemo();
});
