let chance = 0;
let level = "normal";
let round = 1;
const numberList = [];
let result = {
  strike: 0,
  ball: 0,
  out: 0
}

const playground = document.querySelector(".fixed");
const ui_level = document.querySelector(".set-level");
const ui_level_btns = ui_level.querySelectorAll(".set-level-btn");


const rule = {
  "easy": {
    length: 3,
    chance: 15,
    score: 1000
  },
  "normal": {
    length: 4,
    chance: 15,
    score: 1200
  },
  "hard": {
    length: 4,
    chance: 10,
    score: 1500
  }
}


// ? 테스트용 (삭제 예정)
const newLog = (msg) => {
  const p = document.createElement("p");
  p.innerHTML = msg;
  document.body.append(p);
}

// 난수 생성
const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// 난이도 설정
const showLevel = () => {
  newLog("난이도를 결정합니다.");
  ui_level.classList.remove("disabled");
}

const setLevel = (e) => {
  level = e.target.dataset.level;
  newLog(`${level} 레벨입니다.`);
  chance = rule[level].chance;
  newLog(`라운드 횟수는 ${chance}입니다.`)
  ui_level.classList.add("disabled");
  playground.classList.remove("disabled");
  makeNumberList();
  newRound();
}

// 랜덤 배열 생성
const makeNumberList = (length) => {
  let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let maxLength = rule[level].length || 4;

  for (let i = 0; i < maxLength; i++) {
    let num = getRandom(0, list.length);
    let newNum = Number(list.splice(num, 1));
    numberList.push(newNum);
  }

  // newLog(`랜덤으로 [${numberList}] 를 만들었습니다.`);
  console.log(`랜덤으로 [${numberList}] 를 만들었습니다.`);
}


// 새 라운드 시작
const newRound = () => {
  let currentRound = round;
  newLog(`새 라운드입니다. 현재 ${currentRound}라운드 입니다.`)
  newLog(`남은 기회는 ${chance}회입니다.`)
  if (currentRound > chance) {
    newLog(`${chance}라운드를 초과했습니다.`)
    gameOver();
    return false;
  }
}


// 숫자비교
const compareNumbers = (num) => {
  const playerNumberList = num.map(Number);


  for (let i = 0; i < rule[level].length; i++) {

    console.log(`이것은 i다. ${i}번째 반복 중`)

    for (let k = 0; k < rule[level].length; k++) {
      console.log(`이것은 k다. ${k}번째 반복 중`);


      console.dir(`playerNumberList[i]: ${playerNumberList[i]}`);
      console.dir(`numberList[k]: ${numberList[k]}`);


      if (playerNumberList[i] === numberList[k]) {
        if (playerNumberList[i] === numberList[i]) {
          console.log("스트라이크");
          result.strike++;
          break;
        } else {
          console.log("볼");
          result.ball++;
          break;
        }
      }

    }

  }

  if (result.strike <= 0 && result.ball <= 0) {
    console.log("아웃!!!");
    return false;
  }

  return result;
}

// 폼 입력 처리
const validateForm = (input) => {
  let _val = input.value;
  const pattern = new RegExp('^[0-9]$');

  console.log(pattern.test(_val))
  input.value = _val.replace(/[a-z]|[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, '');

  if (_val.length > 1) {
    console.log("길어요!")
    input.value = _val.replace(/.$/, "");
  }

  if (!pattern.test(_val)) {
    input.value = _val.replace(/.$/, "");
  }

  // const nodes = Array.prototype.slice.call(document.getElementById('form').children);
  // let index = nodes.indexOf(input);


  let typedValue = [];
  const form = document.getElementById("form");
  for (let i = 0; i < form.elements.length; i++) {
    let e = form.elements[i];
    if (typedValue.includes(e.value)) {
      if (typedValue[i] === e.value) {
        console.log("?")
      }
      typedValue.push("");
      e.value = "";
      // return false;
    } else {
      typedValue.push(encodeURIComponent(e.value));

    }
    console.log(typedValue)
  }

}

// 입력 결과 보여줌
const showResult = () => {
  const form = document.getElementById("form");
  let playerNumbers = [];
  for (let i = 0; i < form.elements.length; i++) {
    let e = form.elements[i];
    playerNumbers.push(encodeURIComponent(e.value));
  }

  newLog(`${playerNumbers}의 결과...`);
  if (compareNumbers(playerNumbers)) {
    if (result.strike >= rule[level].length) {
      victory();
      return false;
    }
    newLog(`${result.strike} 스트라이크, ${result.ball} 볼`);
  } else {
    newLog(`아웃!`)
  }

  result.strike = 0;
  result.ball = 0;
  result.out = 0;

  round++;
  chance--;
  typedValue = [];
  newRound();

}

// 점수 계산
const getScore = () => {
  let score = 0;
  if (chance >= rule[level].chance) {
    chance = 15;
  }
  score = chance * rule[level].score;
  return score;
}

// 점수 보여주기
const showScore = () => {
  newLog(`${getScore()}점을 얻었습니다. 축하합니다!`);
}

// 승리
const victory = () => {
  playground.classList.add("disabled");
  newLog(`승리했습니다.`)
  showScore();
}

// 게임 오버
const gameOver = () => {
  playground.classList.add("disabled");
  newLog(`게임 오버입니다.`)
}

// 새 게임 시작
const newGame = () => {
  newLog(`새 게임을 시작합니다.`)
  showLevel();
}

ui_level_btns.forEach((btn) => {
  btn.addEventListener("click", setLevel);
})
document.getElementById("nextRound").addEventListener("click", showResult);
window.addEventListener("load", newGame);