console.log("Global Context");

function Example1() {
  console.log("Example 1");
}

function Example2() {
  Example1();
  console.log("Example 2");
}

Example2();