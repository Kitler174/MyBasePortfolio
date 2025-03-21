function startsnake() {
    const canvas = document.getElementById("gameCanvas");
    canvas.width = 800; // Zwiększona szerokość planszy
    canvas.height = 600; // Zwiększona wysokość planszy
    const ctx = canvas.getContext("2d");
    const gameSection = document.getElementById("games"); 
    var highsnake = parseInt(getCookie("snakehighscore"));
    const headImage = new Image();
    headImage.src = "./images/yaakpower2.png";
    const backImage = new Image();
    backImage.src = "./images/yaakpower3.png";
    const wall = new Image();
    wall.src = "./images/wall2.png";
    document.body.style.overflow = "hidden";
    canvas.style.display = "block";
    
    const box = 40;
    
    let snake = [{ x: 10 * box, y: 10 * box },
        { x: 9 * box, y: 10 * box }
    ];
    let direction = "RIGHT";
    let food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    let score = 0;

    window.addEventListener("keydown", (event) => {
        const key = event.key;
        if (key === "ArrowUp" && direction !== "DOWN") {
            event.preventDefault();
            direction = "UP";
        } else if (key === "ArrowDown" && direction !== "UP") {
            event.preventDefault();
            direction = "DOWN";
        } else if (key === "ArrowLeft" && direction !== "RIGHT") {
            event.preventDefault();
            direction = "LEFT";
        } else if (key === "ArrowRight" && direction !== "LEFT") {
            event.preventDefault();
            direction = "RIGHT";
        }
    });

    function drawGame() {
        ctx.fillStyle = "rgba(2, 66, 2, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore()
        ctx.drawImage(wall, food.x, food.y, box, box);

        for (let i = 0; i < snake.length; i++) {
            if (i == 0) {
                ctx.save(); 
                ctx.translate(snake[i].x + box / 2, snake[i].y + box / 2); 
                if (direction === "UP") ctx.rotate(-Math.PI / 2);
                if (direction === "DOWN") ctx.rotate(Math.PI / 2);
                if (direction === "LEFT") ctx.rotate(Math.PI);                
                ctx.drawImage(headImage, -box / 2, -box / 2, box, box);
                ctx.restore(); 
            } 
            else {
                ctx.fillStyle = "#b46930";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
            }
        }
    
        let headX = snake[0].x;
        let headY = snake[0].y;
        if (direction === "UP") headY -= box;
        if (direction === "DOWN") headY += box;
        if (direction === "LEFT") headX -= box;
        if (direction === "RIGHT") headX += box;
    
        if (headX === food.x && headY === food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * (canvas.width / box)) * box,
                y: Math.floor(Math.random() * (canvas.height / box)) * box
            };
        } else {
            snake.pop();
        }
    
        const newHead = { x: headX, y: headY };
        if (
            headX < 0 || headY < 0 ||
            headX >= canvas.width || headY >= canvas.height ||
            collision(newHead, snake)
        ) {
            clearInterval(game);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
            ctx.fillText("Score: " + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
            if (score > highsnake) {
                highsnake = score;
                setCookie("snakehighscore", score);
            }
            return;
        }
    
        snake.unshift(newHead);
    
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
    }
    

    function collision(head, array) {
        return array.some(segment => segment.x === head.x && segment.y === head.y);
    }
    const game = setInterval(drawGame, 110);
    function stopGame() {
        clearInterval(game); 
        canvas.style.display = "none"; 
    }
    stopSnakeButton.addEventListener("click", stopGame);
}
