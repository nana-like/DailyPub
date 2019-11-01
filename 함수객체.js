var foo = function () {
  return function () {
    console.log('This function is the return value.');
  };
};

foo(); //호출되지 않음

var bar = foo();
bar(); //출력값: 'This function is....'




function Person() { }
console.dir(Person);