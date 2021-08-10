let c = document.getElementById("ex");
let ctx = c.getContext("2d");
let enemyImg = new Image();
enemyImg.src = "pictures/bum.gif";
let gameFront, gameFront2, gameBack, gameBack2;
let gameBackX, gameFrontX, gameBack2X, gameFront2X;
let shipY, shipX, shipImg;
let rocketList = [];
let enemyList = [];
let requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame;
let particleList = [];

function start() {
    c = document.getElementById("ex");
    ctx = c.getContext("2d");
    ctx.canvas.hidden = true;
    c.style.cursor = 'none';
    shipY = 400;
    shipX = 100;
    shipImg = new Image();
    shipImg.src = "pictures/ship.png";
    gameFront = new Image();
    gameFront.src = "pictures/gameFront.png";
    gameFront2 = new Image();
    gameFront2.src = "pictures/gameFront.png";
    gameBack = new Image();
    gameBack.src = "pictures/gameBack.jpg";
    gameBack2 = new Image();
    gameBack2.src = "pictures/gameBack.jpg";
    gameBackX = 0;
    gameFrontX = 0;
    gameBack2X = 600;
    gameFront2X = 600;

    c.addEventListener("click", onClick, false);
    c.addEventListener('mousemove', shipMove, false);
    animate();
    setInterval(() =>{
            addEnemy();
    }, 2000)
}

// Drawing, animation

function animate() {
    requestAnimationFrame(animate);
    draw();
    checkCollisionShip();
    checkCollisionRocket();
}

function draw() {
    ctx.clearRect(0,0, c.width, c.height);
    moveBackground();
    drawShip();
    drawRocket()
    removeRocket();
    enemyMove();
    removeEnemy();
    moveParticles();
}

// Game background moving, drawing

function drawBackground() {
    ctx.drawImage(gameBack, gameBackX, 0, 600, 800);
    ctx.drawImage(gameBack2, gameBack2X, 0, 600, 800);
    ctx.drawImage(gameFront, gameFrontX, 0, 600, 800);
    ctx.drawImage(gameFront2, gameFront2X, 0, 600, 800);
}

function moveBackground() {
    gameFrontX -= 0.8;
    gameFront2X -= 0.8;
    gameBackX -= 0.3;
    gameBack2X -= 0.3;
    if (gameFrontX < -600) {
        gameFrontX = 600;
    } else if (gameFront2X < -600) {
        gameFront2X = 600;
    } else if (gameBackX < -600) {
        gameBackX = 600;
    } else if (gameBack2X < -600) {
        gameBack2X = 600;
    }

    drawBackground();
}

// enemy adding, movement, removing

function addEnemy() {
        enemyList.push({
            x: 600,
            y: randomEnemyPos()
        })
}

function removeEnemy() {
    if (enemyList.length > 0 && enemyList[0].x === 0) {
        enemyList.shift();
    }
}

function enemyMove() {
    for (let i in enemyList) {
        let enemy = enemyList[i];

        ctx.fillStyle = "#a90000";
        ctx.beginPath();
        ctx.arc(enemy.x + 10, enemy.y - 35, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(enemy.x - 15, enemy.y - 55, 30, 10);
        ctx.fillRect(enemy.x - 15, enemy.y - 40, 30, 10);
        ctx.fillRect(enemy.x - 15, enemy.y - 25, 30, 10);
        enemy.x -= 0.3;
        enemy.y += randomMove();

    }
}

function randomEnemyPos() {
    return Math.round(Math.random() * 700 + 50);
}

function randomMove() {
    let random = Math.random();
    if (random > 0.9) {
        return -Math.round(Math.random());
    } else if (random < 0.1) {
        return Math.round(Math.random());
    } else {
        return 0;
    }
}

// Hero ship adding, moving, shooting

function shipMove(ev) {
    let rect = c.getBoundingClientRect();
    let mouseX = ev.clientX - rect.left;
    let mouseY = ev.clientY - rect.top;
    if (mouseX > 0 && mouseX < c.width && mouseY > 0 && mouseY < c.height) {
        shipX = mouseX;
        shipY = mouseY;
        drawShip();
    }
}

function drawShip() {
    ctx.drawImage(shipImg, shipX, shipY, 40, 40);
}

function onClick(ev){
    let mouseX = ev.clientX
    let mouseY = ev.clientY
    if (mouseX > 0 && mouseX < c.width && mouseY > 0 && mouseY < c.height) {
        dropRocket();
    }

}

// Rockets adding, removing, moving

function dropRocket() {
    rocketList.push({
        x: shipX,
        y: shipY + shipImg.height / 10
    })
}

function removeRocket() {
    if (rocketList.length > 0 && rocketList[0].x > 600) {
        rocketList.shift();
    }
}

function drawRocket() {
    for (let i in rocketList) {
        let rocket = rocketList[i];
        ctx.fillStyle = "#47ff00";
        ctx.beginPath();
        ctx.arc(rocket.x + 55, rocket.y - 33.5, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillRect(rocket.x + 36, rocket.y - 35, 15, 3);
        rocket.x += 6;
    }
}

// Collision checking

function checkCollisionShip() {
    for (let b in enemyList) {
        let enemy_x = enemyList[b].x;
        let enemy_y = enemyList[b].y;

        if (distance({x: enemy_x, y: enemy_y - 55}, {x: shipX, y: shipY}) < 40 ){
            c.removeEventListener('mousemove', shipMove);
            c.removeEventListener('click', onClick);
            shipImg.src = 'pictures/bum.gif';
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", 200, 400);
            createParticles(shipX, shipY);
            setTimeout(gameOver, 2000);
        }
    }
}

function checkCollisionRocket() {
    for (let b in rocketList) {
        let rocket_x = rocketList[b].x;
        let rocket_y = rocketList[b].y;
        for (let a in enemyList) {
            let enemy_x = enemyList[a].x;
            let enemy_y = enemyList[a].y;

            if (distance({x: rocket_x, y: rocket_y}, {x: enemy_x, y: enemy_y}) < 25) {
                ctx.drawImage(enemyImg, enemy_x - 150, enemy_y - 200);
                particleList = [];
                const index = enemyList.indexOf(enemyList[a]);
                if (index > -1) {
                    enemyList.splice(index, 1);
                }
                createParticles(enemy_x, enemy_y);
                rocketList.shift();
            }
        }
    }
}

function distance(a, b) {
    let dx = a.x - b.x;
    let dy = a.y - b.y;

    return Math.sqrt(dx * dx + dy * dy)
}

//Generating particles

function createParticles(x, y) {
    for (let i = 0; i < 15; i++) {
        particleList.push({
            x: x,
            y: y
        })
    }
}

function moveParticles() {
    for (let i in particleList) {
        let particle = particleList[i];
        ctx.fillStyle = "#bf00ff";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
        ctx.fill();
        particle.x -= randomMove() * 10;
        particle.y -= randomMove() * 10;
    }
}

// Game start and end

function startGame() {
    start();
    ctx.canvas.hidden = false;
    document.getElementById('gameSelect').style.display = 'none';
    let ball = document.getElementsByClassName('ball');
    for (let i = 0; i < ball.length; i++) {
        ball[i].style.opacity = '0';
    }
}

function gameOver() {
    location.reload();
}
