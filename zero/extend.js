function Vehicle(name, speed) {
  this.name = name;
  this.speed = speed;
}

Vehicle.prototype.drive = function () {
  console.log(`${this.name}은(는) ${this.speed}의 속도로 달립니다.`);
}

console.dir(Vehicle);

var tico = new Vehicle("tico", 50);
tico.drive();


function Sedan(name, speed, maxSpeed) {
  Vehicle.apply(this, arguments);
  this.maxSpeed = maxSpeed;
}

Sedan.prototype = Object.create(Vehicle.prototype);
// Sedan.prototype = Vehicle.prototype;
// Sedan.prototype === Vehicle.prototype ? console.log("Y") : console.log("N");
console.dir(Vehicle.prototype);
console.dir(Sedan.prototype);
// console.dir(Sedan);
console.dir(Sedan.prototype.constructor);

Sedan.prototype.constructor = Sedan;
Sedan.prototype.boost = function () {
  console.log(`부스트!!! 이제 ${this.name}은(는) ${this.maxSpeed}의 속도로 달립니다.`);
}
// console.dir(Sedan.prototype);
var sonata = new Sedan("sonata", 100, 200);
sonata.drive();
sonata.boost();


//트럭 추가

function Truck(name, speed, capacity) {
  Vehicle.apply(this, arguments);
  this.capacity = capacity;
}

Truck.prototype = Object.create(Vehicle.prototype);
Truck.prototype.constructor = Truck;
Truck.prototype.load = function (weight) {
  if (weight > this.capacity) {
    return console.error(`${weight - this.capacity}만큼 중량 초과입니다.`);
  }
  console.log(`${weight} 만큼의 짐을 실었습니다.`)
}
var boongboong = new Truck("boongboong", 40, 100);
boongboong.drive();
boongboong.load(130);