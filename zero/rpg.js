/*

  - 캐릭터의 스테이터스는 다음과 같다.
    - 이름
    - HP: (레벨*50) + (레벨*10)
    - 레벨: 레벨이 증가하면 능력치가 증가한다.
    - 공격력: 레벨*30 + 직업 보정 20/10/0%
    - 방어력: 레벨*50 + 직업 보정 20/10/0%
    - 행운: 레벨*20 + 직업 보정 20/10/0%
    - 경험치: 플레이어만. 50 + 현재레벨*80 만큼 모이면 레벨업.
    - 직업: 플레이어만. 마법사(0, 공격력 위주), 전사(1, 방어력 위주), 도적(2, 행운 위주)
    - 보상: 몬스터만. 5~30+(레벨*20)의 경험치와 10~50+(레벨*10)만큼의 골드를 준다.
    - 소지금 : 플레이어만.
  
  - 데미지 산출은 (공격력±10% - 방어력±5%) * 2 이다.
  - 크리티컬 확률은 2*(공격자 행운 - 방어자 행운)%이다. 크리티컬이 발생하면 최종 데미지는 두 배가 된다.
  - 회피 확률은 (방어자 행운 > 공격자 행운)일 때 5% 확률로 발생한다. 회피가 발생하면 데미지는 0이 된다.

  - 전투에서 승리하면 적의 레벨에 비례해 돈을 얻는다.
  - 얻은 돈은 여관에서 휴식하는 데 사용한다.

  - 레벨업하는 경우 모든 HP를 회복한다.
  - 어느 한 쪽의 HP가 0이 되면 전투는 종료된다.

  - 여관에서는 n골드 만큼의 돈을 지불하여 완전히 회복할 수 있다.

  - 게임 시작 시 캐릭터 이름을 받는다.
  - 캐릭터 레벨은 1로 시작.



  할 일!!

  1. 캐릭터를 다루는 생성자 함수를 만든다.
  2. 플레이어를 다루는 생성자 함수를 만든다.
  3. 몬스터를 다루는 생성자 함수를 만든다.
  4. 전투 함수를 만든다.
  5. 공격, 방어, 크리티컬, 회피 함수를 만든다.
  6. 전투 승리 함수를 만든다.
  7. 전투 패배 함수를 만든다.
  8. 레벨업 함수를 만든다.
  9. 여관 함수를 만든다.
 

  (UPDATE)
  - 전투는 매턴 선택지를 고를 수 있다.
    - 공격: 대상을 공격한다.
    - 방어: 방어력이 10% 증가한다.
    - 회복: 아이템을 써서 회복한다.
    - 도망: 전투를 포기한다. 확률은 5*(공격자 행운 - 방어자 행운)%이다.


 */


var getRandom = function (min, max) {
  min = Math.ceil(min) || 0;
  max = Math.floor(max) || 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


var ctrl = {
  levUpVal: {
    hp: [50, 10], //(레벨*50) + (레벨*10)
    atk: 30, //(레벨*30) + 보정
    def: 40, //(레벨*40) + 보정
    luk: 10 //(레벨*10) + 보정
  },
  jobBonus: [10, 5, 0]
}

console.log((ctrl.levUpVal.hp[0]))

var log = function (msg) {
  var p = document.createElement("p");
  p.innerHTML = msg;
  document.getElementById("log").appendChild(p);
}

var Character = function (name, level, hp, atk, def, luk) {
  this.name = name;
  this.level = level || 1;
  this.hp = hp || ((this.level * ctrl.levUpVal.hp[0]) + (this.level * ctrl.levUpVal.hp[1]));
  this.atk = atk || this.level * ctrl.levUpVal.atk;
  this.def = def || this.level * ctrl.levUpVal.def;
  this.luk = luk || this.level * ctrl.levUpVal.luk;
}

var Player = function (name, level, hp, atk, def, luk, exp, job, money) {
  Character.apply(this, arguments);
  this.exp = exp || 0;
  this.job = job || "도적";
  this.money = money || 0;
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

var monsterList = [
  //이름, 레벨, HP, 공격력, 방어력, 행운
  ["슬라임", 1, 80, 5, 10, 10],
  ["늑대", 2, 100, 12, 10, 5],
  ["고블린", 3, 130, 16, 16, 1]
]

var makeMonster = function () {
  var newMonster = new Character();
  Character.apply(newMonster, monsterList[0]);
  return newMonster;
}

// ++++
// 글로벌 변수
var battle = false;
// ++++

// 공격
Character.prototype.attack = function (target) {

  var self = this;

  // 공격 시작
  log(`${this.name}가 ${target.name}을 공격한다.`);

  // 데미지 산출
  var atkCalc = (Math.floor(Math.random() * (this.atk * 0.1 * 2 + 1)) - (this.atk * 0.1));
  var defCalc = (Math.floor(Math.random() * (target.def * 0.05 * 2 + 1)) - (target.def * 0.05));
  atkCalc < 1 ? atkCalc = 0 : atkCalc;
  defCalc < 1 ? defCalc = 0 : defCalc;
  var damage = ((this.atk + atkCalc) - (target.def + defCalc));

  // 크리티컬 확률 계산
  var isCritical = function () {
    var criRate = 2;
    if (getRandom() <= (self.luk - target.luk) * criRate) {
      return true;
    }
  };


  // 공격 실패
  if (damage <= 0) {
    log(`공격에 실패했다...`);
    return false;
  }

  // 크리티컬 여부
  if (isCritical()) {
    log(`크리티컬 히트!`);
    damage *= 2;
  }


  // 공격 성공
  target.hp -= damage;


  // 적의 HP 판단
  if (target.hp >= 0) {
    log(`${damage}의 데미지를 입혔다. (${target.name}의 HP: ${target.hp})`);
  } else {
    target.hp = 0
    log(`${damage}의 데미지를 입혔다. (${target.name}의 HP: ${target.hp})`);
    self.battleDone("victory", target);
  }

}

//전투 종료
Player.prototype.battleDone = function (type, target) {

  var self = this;

  // 패배로 인한 전투 종료인지 판단
  if (type === "defeat") {
    log(`전투에서 패배했다...`);
    return false;
  }

  // 도망으로 인한 전투 종료인지 판단
  if (type === "escape") {
    log(`전투에서 도망쳤다...`);
    return false;
  }

  // 승리로 인한 전투종료인 경우
  log(`${target.name}을 물리쳤다!`);


  // 보상으로 얻을 경험치와 골드 계산
  var gainedExp = getRandom(5, 30) + (target.level * 30);
  var gainedGold = getRandom(10, 50) + (target.level * 20);


  // 보상 획득
  self.exp += gainedExp;
  self.money += gainedGold;
  log(`${gainedExp} Exp를 획득했다. (현재 경험치: ${self.exp} Exp)`);
  log(`${gainedGold} 골드를 획득했다. (현재 소지금: ${self.money} 골드)`);


  // 레벨업 판단
  if (this.exp >= (50 + this.level * 80)) {
    self.levelUp();
  }

}


Player.prototype.levelUp = function () {

  // 레벨 업
  this.level += 1;
  log(`레벨 업! 레벨 ${this.level}이(가) 되었다.`);

  // 공격력 향상
  if (this.job === "마법사") {
    this.atk = (this.level * ctrl.levUpVal.atk) * (1 + ctrl.jobBonus[0] / 100);
  } else if (this.job === "전사") {
    this.atk = (this.level * ctrl.levUpVal.atk) * (1 + ctrl.jobBonus[1] / 100);
  } else if (this.job === "도적") {
    this.atk = (this.level * ctrl.levUpVal.atk) * (1 + ctrl.jobBonus[2] / 100);
  }

  // 방어력 향상
  if (this.job === "마법사") {
    this.def = (this.level * ctrl.levUpVal.def) * (1 + ctrl.jobBonus[2] / 100);
  } else if (this.job === "전사") {
    this.def = (this.level * ctrl.levUpVal.def) * (1 + ctrl.jobBonus[0] / 100);
  } else if (this.job === "도적") {
    this.def = (this.level * ctrl.levUpVal.def) * (1 + ctrl.jobBonus[1] / 100);
  }

  // 행운 향상
  if (this.job === "마법사") {
    this.luk = (this.level * ctrl.levUpVal.luk) * (1 + ctrl.jobBonus[1] / 100);
  } else if (this.job === "전사") {
    this.luk = (this.level * ctrl.levUpVal.luk) * (1 + ctrl.jobBonus[2] / 100);
  } else if (this.job === "도적") {
    this.luk = (this.level * ctrl.levUpVal.luk) * (1 + ctrl.jobBonus[0] / 100);
  }



}


var nana = new Player("Nana");
var m = makeMonster();
nana.attack(m);
nana.attack(m);
nana.attack(m);
nana.attack(m);
nana.attack(m);
nana.attack(m);