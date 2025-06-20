function set(){
   


let principal = parseFloat(prompt("Enter the principal amount:"));
let rate = parseFloat(prompt("Enter the annual interest rate (in %):"));
let time = parseFloat(prompt("Enter the time in years:"));


if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
  console.log("Error: One or more inputs are not numbers.");
} else if (principal <= 0) {
  console.log("Error: Principal must be greater than 0.");
} else if (rate <= 0) {
  console.log("Error: Rate must be greater than 0.");
} else if (time <= 0) {
  console.log("Error: Time must be greater than 0.");
} else {
  
  let simpleInterest = (principal * rate * time) / 100;
  console.log("The simple interest is: " + simpleInterest);
}

}