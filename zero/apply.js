var person = {
  whois: function (country) {
    console.log(this.firstName + " " + this.lastName + " from " + country);
  }
}

var nana = {
  firstName: "nana",
  lastName: "kim"
}

person.whois.apply(nana, ["korea"]);