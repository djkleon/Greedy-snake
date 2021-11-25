const main = document.querySelector('tbody');
const reStart = document.getElementsByTagName('span')[0];
const timeCtrl = 200;
const widthNum = 20;
let score = 0;
const dir = { to: 'right' };
const snakeHeadPos = [3, 0]
const snakeBodyArr = [[2, 0], [1, 0], [0, 0]];

/**
 * 生成地图所有的格子的dom结构并插入html，并且放进数组，把数组返回
 */
function createBoxesDom() {
    const trs = [];
    for (let i = 0; i < widthNum; i++) {
        const tr = document.createElement('tr')
        main.appendChild(tr);
        const tds = [];
        for (let j = 0; j < widthNum; j++) {
            const td = document.createElement('td');
            tr.appendChild(td);
            tds.push(td)
        }
        trs.push(tds);

    }
    return trs;
}
//生成蛇的身体和头，是一个每一项是(x,y)的数组，同时渲染dom，让其在html中展示
function setHeadAndBody(head, body) {//head是蛇头的坐标（一维数组），body是蛇的身体坐标（二维数组）
    for (let i = 0; i < body.length; i++) {
        let onebody = map[body[i][1]][[body[i][0]]];
        onebody.className = 'body';
        // console.log(  map[body[i][1]][[body[i][0]]]);
    }
    const theHead = map[head[1]][head[0]];
    //判断蛇头的方向
    let s;
    switch (direction().to) {
        case "right": s = 'rotate0';
            break;
        case "left": s = "rotate180";
            break;
        case "up": s = "rotate270";
            break;
        case "down": s = "rotate90";
            break;
    }
    theHead.className = 'header' + ' ' + `${s}`;
}
//放食物，生成二维随机数，范围是在蛇的身体和头之外，同时渲染dom，让食物在html中展示,返回食物的坐标数组；
function setFoodPos() {
    function setNum() {
        let x = parseInt(Math.random() * widthNum);
        let y = parseInt(Math.random() * widthNum);
        return [x, y];
    }
    arr = setNum();
    for (let i = 0; i < snakeBodyArr.length; i++) {
        if (JSON.stringify(snakeBodyArr[i]) === JSON.stringify(arr) || JSON.stringify(snakeHeadPos) === JSON.stringify(arr)) {
            // console.log(JSON.stringify(snakeBodyArr[i]),JSON.stringify(arr));
            arr = setNum();
            // console.log(arr);
        }
    }
    const food = map[arr[1]][arr[0]];
    food.className = 'food';
    return arr;
}
//设置接下来要走的方向
function direction() {
    document.onkeydown = function (event) {
        const e = event || window.e;
        const keyCode = e.keyCode || e.which;
        if (keyCode === 38 && dir.to != "down") {
            dir.to = "up";
        } else if (keyCode === 39 && dir.to != "left") {
            dir.to = "right";
        } else if (keyCode === 40 && dir.to != "up") {
            dir.to = "down";
        } else if (keyCode === 37 && dir.to != "right") {
            dir.to = "left";
        }
    }
    return dir;
}
//移动
//蛇的移动，默认向右移动；
//绑定事件改变移动方向
//设置计时器蛇移动，蛇的头的样式改成身体样式，蛇的尾巴的样式改为空的样式，蛇的头根据当前方向移动一格
function move() {
    const timer = setInterval(function () {
        const arr = [...snakeHeadPos]
        snakeBodyArr.unshift(arr);
        const last = snakeBodyArr.pop();

        switch (direction().to) {
            case "up":
                snakeHeadPos[1] -= 1;
                break;
            case "right":
                snakeHeadPos[0] += 1;
                break;
            case "down":
                snakeHeadPos[1] += 1;
                break;
            case "left":
                snakeHeadPos[0] -= 1;
                break;
        }
        //碰撞边缘检测
        if (snakeHeadPos[0] < 0 || snakeHeadPos[0] > widthNum - 1 || snakeHeadPos[1] < 0 || snakeHeadPos[1] > widthNum - 1) {
            clearInterval(timer);
            alert(`你的分数：${score}分`);

            return;
        }
        //碰撞自己身体检测
        for (let i = 0; i < snakeBodyArr.length; i++) {
            if (JSON.stringify(snakeBodyArr[i]) === JSON.stringify(snakeHeadPos)) {
                clearInterval(timer);
                alert(`你的分数：${score}分`);
                return;
            }
        }
        //碰撞食物检测
        if (snakeHeadPos[0] == foodPos[0] && snakeHeadPos[1] == foodPos[1]) {
            score++;
            foodPos = setFoodPos();
            snakeBodyArr.push(last);
        }
        map[last[1]][last[0]].className = ''
        setHeadAndBody(snakeHeadPos, snakeBodyArr);
        //
        return last;
    }, timeCtrl)
}
//点击重新开始
function start() {
    reStart.onclick = (function () {
        location.reload();
    })
}
const map = createBoxesDom()
// console.log(map);
const AllTd = document.querySelectorAll('td');
setHeadAndBody(snakeHeadPos, snakeBodyArr)
let foodPos = setFoodPos()
// console.log(setFoodPos());
move()
start()
