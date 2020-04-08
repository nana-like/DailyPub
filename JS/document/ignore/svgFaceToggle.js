var button = document.getElementById('button');

// opacity:0으로 숨겨져 있는 노란 얼굴
var face = document.getElementById('face');


var pop = document.getElementById('pop');

// 일반 _ 입
var mouth = document.getElementById('mouth');
var mouthClipPath = document.getElementById('mouth-clip-path');
var tongue = document.getElementById('tongue');
var eyeL = document.getElementById('eye-l');
var eyeR = document.getElementById('eye-r');
var heartL = document.getElementById('heart-l');
var heartR = document.getElementById('heart-r');
var cheekL = document.getElementById('cheek-l');
var cheekR = document.getElementById('cheek-r');


var mouthLike = "M128,151.1 L75,151.1 C71.9,151.1,68.2,152.6,68,157.6 C67.8,161,69.2,165,69.8,166.5 C71.3,171,90,206.1,128,206.2 C167.2,206.2,185.3,169.7,186.6,165.4 C187.3,162.6,188.1,160.3,188,157.6 C187.8,153.6,181.4,151.1,181.4,151.1 Z";
var faceStatus = false;


// 초기 세팅
TweenMax.set(heartL, {
  opacity: 1,
  scale: 0,
  rotation: "10deg",
  transformOrigin: "50% 50%"
});
TweenMax.set(heartR, {
  opacity: 1,
  scale: 0,
  rotation: "-10deg",
  transformOrigin: "50% 50%"
});
TweenMax.set(tongue, {
  y: 30
});
TweenMax.set(pop, {
  opacity: .5,
  transformOrigin: "50% 50%"
});



// create timeline
var faceTl = new TimelineMax({
  paused: false
});
faceTl
  // fade in face background
  .to(face, .2, {
    opacity: 1,
    ease: Linear.easeNone
  }, "0")

  // morph mouth to smile
  .to([mouth, mouthClipPath], .3, {
    morphSVG: mouthLike,
    ease: Power2.easeOut
  }, "0")

  // move tongue up
  .to(tongue, .3, {
    y: 0,
    ease: Power2.easeOut
  }, "0")

  // bring heart eyes in, with slight delay on the right one
  .to([heartL, heartR], .3, {
    rotation: "0deg",
    ease: Power1.easeOut
  }, "0")
  .to(heartL, .3, {
    scale: 1.25,
    ease: CustomEase.create("custom", "M0,0 C0.076,0.15 0.15,1.111 0.71,1.112 0.876,1.112 0.832,1 1,1")
  }, "0")
  .to(heartR, .3, {
    scale: 1.25,
    ease: CustomEase.create("custom", "M0,0 C0.076,0.15 0.15,1.111 0.71,1.112 0.876,1.112 0.832,1 1,1")
  }, ".1")

  // fade cheeks in
  .to([cheekL, cheekR], .4, {
    opacity: .2,
    ease: Linear.easeNone
  }, "0");