var battle = false;

function combat() {
  var random = Math.floor(Math.random() * 101);
  console.log(random + "이 나왔다.")
  if (random <= 50) {
    console.log("50보다 작으므로 배틀 종료.")
    battle = false;
  }
}

function battleStart() {
  console.log("배틀 시작!!!");
  battle = true;


  while (battle) {
    console.log("배틀 중...");
    combat();
  }
}

battleStart();