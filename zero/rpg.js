

// 로그 출력 함수
function logMessage(msg, color) {
  if (!color) { color = "#333333" };
  var p = document.createElement("p");
  p.innerHTML = msg;
  p.style.color = color;
  document.querySelector("#log").appendChild(p);
}


var gameover = false; //게임오버 체크
var battle = false; //전투여부 체크

function Character(name, hp, att) {
  this.name = name;
  this.hp = hp;
  this.att = att;
}

Character.prototype.attacked = function (damage) {
  console.log(this.hp);
  this.hp -= damage;
  logMessage(`${this.name} : ${damage}의 피해를 받았다. HP가 ${this.hp}가 되었다.`, "crimson");
  if (this.hp <= 0) { battle = false; }
}

Character.prototype.attack = function (target) {
  logMessage(`${this.name}이 ${target.name}을 공격했다!`);
  target.attacked(this.att);
}


function Hero(name, hp, att, lev, xp) {
  Character.apply(this, arguments);
  this.lev = lev || 1;
  this.xp = xp || 0;
}

Hero.prototype = Object.create(Character.prototype);
Hero.prototype.constructor = Hero;

var hero = new Hero('이름을 입력', 100, 10);
logMessage(hero.name + '님이 모험을 시작합니다. 어느 정도까지 성장할 수 있을까요?');

var monster = new Character("몬스터", 103, 3)
logMessage(monster.name + '을(를) 마주쳤습니다. 전투가 시작됩니다', 'green');
battle = true;
hero.attack(monster);
console.dir(monster);



/*

  게임 시작 시 캐릭터 이름을 받는다.
  캐릭터 레벨은 1로 시작.
  캐릭터의 스테이터스는 다음과 같다.
  - 레벨: 레벨이 증가하면 스테이터스가 증가한다.
  - 경험치: 100 + 레벨*20 만큼 모이면 레벨업.
  - 직업: 전사(방어력 위주), 마법사(공격력 위주), 궁수(민첩성 위주), 도적(행운 위주)
  - 공격력: 레벨 * 50 + 직업 보정 20%(마법사)
  - 방어력: 레벨 * 50 + 직업 보정 20%(전사)
  - 민첩성: 레벨 * 50 + 직업 보정 20%(궁수)
  - 행운: 레벨 * 50 + 직업 보정 20%(도적)

  게임의 기능은 크게 두 가지.
  1) 던전  2) 여관

  던전 진입 시 랜덤으로 몬스터가 출현한다.



 */
