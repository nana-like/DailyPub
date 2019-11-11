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
  - 크리티컬 확률은 2*(공격자 행운 - 방어자 행운)이다. 크리티컬이 발생하면 최종 데미지는 두 배가 된다.
  - 회피 확률은 무조건 1%로 발생한다. (행운 차이)가 0 이상이면 5%확률로 발생한다. 만약 행운 차이가 2배라면 30%로 발생한다. 행운 차이가 3배라면 50%로 발생한다. 회피가 발생하면 데미지는 0이 된다.

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


    (던전 진입) -> (몬스터 생성) -> (선공 결정) -> 선공 공격 -> 후공 공격 -> 전투 종료



    ****************************************

    //마지막 TODO: 11/8 금

    - 패배 시 경험치 잃어버리는 기능 🌕
    - 플레이어 레벨에 맞춰 몬스터 랜덤 등장 🌑
    - 던전 내 회복 기능 추가 🌕
    - 항시 보여지는 스테이터스창 추가 🌕
    - UI 변경 (누구의 턴인지 알기 쉽게) 🌕



    // 나중에 추가....?
    - 방어 기능 추가 🌑
    - 도망 기능 추가 🌑
    - 최초 이름 입력 / 직업 선택 팝업? 추가 🌑


    ****************************************

 */

/*
 * ===== 글로벌 =====
 */

// 전투 중인지 체크
var battle = false;

// 턴의 주인 (누가 선공인지 체크)
var turnMaster;

// 셀렉터
var battleMenu = document.querySelector(".battleMenu");
var dungeonMenu = document.querySelector(".dungeonMenu");
var playerChar = document.querySelector(".player");
var monsterChar = document.querySelector(".monster");
var logArea = document.getElementById("log");


// 밸런스 컨트롤러
var ctrl = {
  // 레벨업 시 상승하는 스테이터스
  levUpVal: {
    hp: [50, 10], // (레벨*50) + (레벨*10)
    atk: 25, // (레벨*25) + 보정
    def: 40, // (레벨*40) + 보정
    luk: 10 // (레벨*10) + 보정
  },
  // 직업별 보정 수치
  jobBonus: [10, 5, 0] // 10/5/0%만큼 추가 스테이터스
}

// 몬스터 리스트
var monsterList = {
  //이름, 레벨, HP, 공격력, 방어력, 행운
  0: [
    ["슬라임", 1, 50, 45, 10, 0],
    ["여우", 2, 80, 50, 15, 15]
  ],
  1: [
    ["늑대", 2, 110, 70, 24, 0],
    ["고블린", 3, 130, 65, 39, 30]
  ],
  2: [
    ["그리즐리 베어", 3, 140, 80, 31, 0],
    ["고블린 전사", 4, 160, 90, 45, 80]
  ]
}

// 난수 생성
var getRandom = function (min, max) {
  min = Math.ceil(min) || 0;
  max = Math.floor(max) || 100;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// 로그 출력
var log = function (msg, className) {
  var p = document.createElement("p");
  var className = className || "normal";
  className = "msg-" + className;
  p.innerHTML = msg;
  p.classList.add(className);
  logArea.prepend(p);
}


// 몬스터 생성 함수
var makeMonster = function (lv) {
  var lv = lv || 0;
  var newMonster = new Character();
  Character.apply(newMonster, monsterList[lv][0]);
  return newMonster;
}


// 캐릭터 생성자 
var Character = function (name, level, hp, atk, def, luk) {
  this.name = name;
  this.level = level || 1;
  this.hp = hp || ((this.level * ctrl.levUpVal.hp[0]) + (this.level * ctrl.levUpVal.hp[1]));
  this.atk = atk || this.level * ctrl.levUpVal.atk;
  this.def = def || this.level * ctrl.levUpVal.def;
  this.luk = luk || this.level * ctrl.levUpVal.luk;
  this.maxHp = this.hp;
}

// 플레이어 생성자 (exp, job, money)
var Player = function (name, level, hp, atk, def, luk, exp, job, money, goalExp, vicCount, defCount) {
  Character.apply(this, arguments);
  this.exp = exp || 0;
  this.job = job || "마법사";
  this.money = money || 0;
  this.goalExp = 120;
  this.vicCount = vicCount || 0;
  this.defCount = defCount || 0;
}

// 프로토타입 연결
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;


// 공격 메서드
Character.prototype.attack = function (target, type) {

  var self = this;
  var target = target;
  var type = type || "";

  // 데미지 산출
  var atkCalc = (Math.floor(Math.random() * (self.atk * 0.1 * 2 + 1)) - (self.atk * 0.1));
  var defCalc = (Math.floor(Math.random() * (target.def * 0.05 * 2 + 1)) - (target.def * 0.05));
  atkCalc < 1 ? atkCalc = 0 : atkCalc;
  defCalc < 1 ? defCalc = 0 : defCalc;
  var damage = Math.ceil(((self.atk + atkCalc) - (target.def + defCalc)));


  // 크리티컬 확률 계산
  var isCritical = function () {
    var criRate = 2;
    if (getRandom() <= (self.luk - target.luk) * criRate) {
      return true;
    }
  };

  // 회피 확률 계산
  var isEvade = function () {

    var evadeRate = 1;

    if (self.luk > target.luk) {
      evadeRate = 5;
    }
    if (self.luk >= (target.luk * 2)) {
      evadeRate = 30;
    }
    if (self.luk >= (target.luk * 3)) {
      evadeRate = 50;
    }

    if (getRandom() <= evadeRate) {
      return true;
    }

  };


  // 공격 시작
  var battleOn = function () {
    log(`🗡 ${self.name}이(가) ${target.name}을(를) 공격한다.`, "tryToAtk");
  }

  // 공격 결과 판정
  var battleResult = function () {

    // 공격 실패
    if (damage <= 0) {
      log(`😓 공격에 실패했다...`, "fail");
      command.off();
      return false;
    }

    // 크리티컬 여부
    if (isCritical()) {
      log(`⚡️ 크리티컬 히트!`, "cri");
      damage *= 2;
    } else {
      // 크리티컬이 없었다면 회피 여부 판단
      if (isEvade()) {
        log(`🍃 ${target.name}이(가) 공격을 회피했다.`, "fail");
        return false;
      }
    }


    // 공격 성공 시 데미지 입힘
    target.hp -= damage;
    profileUpdate_health();

    // HP 판단
    if (target.hp >= 0) {
      log(`💥 ${target.name}에게 ${damage}의 데미지를 입혔다. (${target.name}의 HP: ${target.hp})`, "atk");
    } else {
      // 대상의 HP가 0 이하라면
      target.hp = 0
      log(`💥 ${target.name}에게 ${damage}의 데미지를 입혔다. (${target.name}의 HP: ${target.hp})`, "atk");

      //배틀 종료
      battle = false;

      if (target.__proto__ === Player.prototype) {
        // 타겟 = 플레이어인 경우 패배 처리
        self.battleDone("defeat");
      } else {
        // 타겟 ≠ 플레이어인 경우 승리 처리
        self.battleDone("victory", target);
      }
    }
  }


  // 회복 메서드인 경우
  if (type === "recovery") {
    log(`💤 이번 턴에 ${this.name}은(는) 휴식을 취한다.`);
    playerChar.classList.remove("turnOwner");

    setTimeout(function () {
      self.recovery();
      log(`😊 체력을 회복했다. (${self.name}의 HP: ${self.hp})`);
    }, 1500);
    return false;
  }


  // 1. 몬스터가 공격하는 경우
  if (target.__proto__ === Player.prototype) {


    if (self.hp <= 0) {
      // 공격 시점에서 hp가 0 이하라면 중단
      return false;
    }

    // 메뉴 OFF
    command.off();

    // 공격 메시지 출력
    setTimeout(function () {
      monsterChar.classList.add("turnOwner");
      battleOn();
    }, 1500);

    // 공격 결과 출력
    setTimeout(function () {
      battleResult();
      if (player.hp <= 0) {
        // 이 시점에서 플레이어 hp 0 이하라면 커맨드 OFF
        return false;
      }
      // 메뉴 ON
      command.on();

      playerChar.classList.add("turnOwner");
      monsterChar.classList.remove("turnOwner");
    }, 2500);
  } else {
    // 2. 내가 공격하는 경우
    // 메뉴 ON
    command.on();
    // 공격 메시지 출력
    battleOn();

    // 공격 결과 출력
    setTimeout(function () {
      battleResult();
      // 메뉴 OFF
      command.off();
      playerChar.classList.remove("turnOwner");
    }, 1000);
  }

}


// 전투 시작 메서드
Character.prototype.battleStart = function (lv) {

  //전투 커맨드 노출
  command.show();

  //던전 커맨드 숨기기
  command.dungeon.hide();

  // 몬스터 생성
  monster = makeMonster(lv);
  log(`👻 ${monster.name}이(가) 나타났다...!`, "appear");

  // 선공 후공 결정
  if (getRandom() <= 50) {
    // 플레이어 선공
    turnMaster = player;
    command.on();
    playerChar.classList.add("turnOwner");
    log(`😁 선공이다! ${turnMaster.name}은(는) ${monster.name}을(를) 먼저 공격할 수 있다.`);
  } else {
    // 플레이어 후공
    turnMaster = monster;
    command.off();
    monsterChar.classList.add("turnOwner");
    log(`😰 기습이다! ${turnMaster.name}이(가) 먼저 공격해 올 것이다.`);
    turnMaster.attack(player);
  }

  // 전투 시작
  battle = true;

};


// 전투 종료 메서드
Character.prototype.battleDone = function (type, target) {

  // 전투 커맨드 OFF
  command.off();
  console.dir(battleMenu.classList);

  var self = this;
  var target = target || player;

  // 패배로 인한 전투 종료인지 판단
  if (type === "defeat") {
    // 패배 시 경험치 30% 감소
    player.exp = player.exp - Math.floor((player.exp * 30 / 100));
    log(`☠️ 전투에서 패배했다... 경험치를 30% 잃어버렸다. (현재 경험치: ${player.exp} Exp)`, "def");
    command.off();
    player.defCount++;
    profileUpdate_history();

    setTimeout(function () {
      log(`......`);
    }, 1000);
    setTimeout(function () {
      log(`😥 잠시 쉬고 일어나 체력을 모두 회복했다. 다시 가보자!`);
      // 체력 회복
      player.hp = player.maxHp;
      profileUpdate_health();

      // 던전 커맨드 ON
      command.hide();
      command.dungeon.show();
      command.dungeon.on();
    }, 2000);

    return false;
  }

  // 도망으로 인한 전투 종료인지 판단
  if (type === "escape") {
    log(`💨 전투에서 도망쳤다...`);
    command.dungeon.on();
    return false;
  }

  // 승리로 인한 전투종료인 경우
  log(`🎉 전투에서 승리했다! ${target.name}을 물리쳤다.`, "vic");
  player.vicCount++;


  // 보상으로 얻을 경험치와 골드 계산
  var gainedExp = Math.floor(getRandom(5, 30) + (target.level * 60));
  var gainedGold = Math.floor(getRandom(10, 50) + (target.level * 30));


  // 보상 획득
  self.exp += gainedExp;
  self.money += gainedGold;
  log(`👑 ${gainedExp} Exp를 획득했다.`, "gainExp");
  log(`💰 ${gainedGold} Gold를 획득했다.`, "gainMoney");

  //프로필에 반영
  profileUpdate_basic();
  profileUpdate_level();
  profileUpdate_history();


  // 레벨업 판단
  if (this.exp >= this.goalExp) {
    self.levelUp();
  }

  //배틀 종료
  battle = false;

  //전투 커맨드 숨기기
  command.hide();

  //던전 커맨드 노출
  command.dungeon.show();
  command.dungeon.on();
  playerChar.classList.remove("turnOwner");
  monsterChar.classList.remove("turnOwner");


}


// 회복 메서드
Character.prototype.recovery = function () {
  // 휴식 시 체력 40% 회복
  this.hp = this.hp + Math.floor((this.hp * 40 / 100));
  //(단, 체대 체력을 초과할 수 없음)
  if (this.hp >= this.maxHp) {
    this.hp = this.maxHp;
  }
  //프로필에 반영
  profileUpdate_health();
}


// 레벨업 메서드
Player.prototype.levelUp = function () {

  // 레벨 업
  this.level += 1;
  log(`🆙 레벨 업! 레벨 ${this.level}이(가) 되었다.`, "lvup");

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

  // 체력 향상
  this.hp = (this.level * ctrl.levUpVal.hp[0]) + (this.level * ctrl.levUpVal.hp[1]);
  this.maxHp = this.hp;

  // 목표 경험치 반영
  this.exp = 0;
  this.goalExp = (this.level * 30) + (this.level * 120);

  // 프로필에 반영
  profileUpdate_level();
  profileUpdate_basic();
  profileUpdate_health();

}

// 스테이터스 프로필 업데이트
var profileUpdate_basic = function () {
  var infoBasic = document.querySelector(".info-basic");
  var infoBasicVal = [player.name, player.job, player.money];
  infoBasicVal.forEach(function (val, index) {
    infoBasic.children[index].innerHTML = val;
  });
}

var profileUpdate_level = function () {
  var infoLevel = document.querySelector(".info-level");
  var expPercent = Math.floor((player.exp * 100) / player.goalExp);
  infoLevel.children[0].children[1].innerHTML = player.level;
  infoLevel.children[1].children[1].children[0].children[0].style.width = expPercent + "%";
  infoLevel.children[1].children[1].children[0].children[1].innerHTML = `${player.exp} / ${player.goalExp} (${expPercent}%)`;
}


var profileUpdate_health = function () {
  var infoHealth = document.querySelector(".status-hp");
  var hpPercent = Math.floor((player.hp * 100) / player.maxHp);
  if (hpPercent <= 0) {
    hpPercent = 0;
  }
  infoHealth.children[1].children[0].children[0].style.width = hpPercent + "%";
  infoHealth.children[1].children[0].children[1].innerHTML = `${player.hp} / ${player.maxHp} (${hpPercent}%)`;
}


var profileUpdate_history = function () {
  var infoHistory = document.querySelector(".info-history");
  infoHistory.children[0].children[1].innerHTML = player.vicCount;
  infoHistory.children[1].children[1].innerHTML = player.defCount;
}



// 던전 입장
var enterDungeon = function () {
  log("🥾 던전에 들어왔다...");
  profileUpdate_basic();
  profileUpdate_level();
  profileUpdate_health();
  profileUpdate_history();


  command.hide();
  command.dungeon.on();
};

// 던전 진행
var nextDungeon = function () {
  log("🧭 던전 안을 향해 들어가본다...");
  command.dungeon.off();

  setTimeout(function () {
    var random = getRandom(-3, 3);
    var monsterLevel = player.level + random;
    if (monsterLevel <= 0) {
      monsterLevel = 0;
    } else if (monsterLevel >= 2) {
      monsterLevel = 2;
    }
    player.battleStart(monsterLevel);
  }, 1000);
};



var command = {
  on: function () {
    battleMenu.classList.add("on");
  },
  off: function () {
    battleMenu.classList.remove("on");
  },
  show: function () {
    battleMenu.classList.remove("hide");
  },
  hide: function () {
    battleMenu.classList.add("hide");
  },
  atk: function (type) {
    player.attack(monster, type);
    command.off();

    if (monster.hp >= 0) {
      setTimeout(function () {
        command.off();
        monster.attack(player);
      }, 1000);
    }
  },
  recovery: function () {
    player.recovery();
  },
  dungeon: {
    on: function () {
      dungeonMenu.classList.add("on");
    },
    off: function () {
      dungeonMenu.classList.remove("on");
    },
    show: function () {
      dungeonMenu.classList.remove("hide");
    },
    hide: function () {
      dungeonMenu.classList.add("hide");
    },
    recovery: function () {
      player.recovery();
      log(`😊 체력을 회복했다. (${player.name}의 HP: ${player.hp})`);

    }
  },
  scene: {
    monsterShow: function () {
      monsterChar.classList.add("show");
    },
    monsterHide: function () {
      monsterChar.classList.remove("show");
    }
  }
}



battleMenu.addEventListener("click", function (e) {
  console.dir(e.target);
  if (e.target === battleMenu.children[0]) {
    command.atk();
  }
  if (e.target === battleMenu.children[1]) {
    command.atk("recovery");
  }
});
dungeonMenu.addEventListener("click", function (e) {
  console.dir(e.target);
  if (e.target === dungeonMenu.children[0]) {
    nextDungeon();
  }
  if (e.target === dungeonMenu.children[1]) {
    command.dungeon.recovery();
  }
});





// 새 플레이어 생성
var player = new Player(prompt("이름을 입력하세요."));
// var player = new Player("플록스");


// 게임 시작
enterDungeon();

