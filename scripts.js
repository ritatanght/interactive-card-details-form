// info on card image
let cardCvc = document.getElementById("card-cvc");
let cardNum = document.getElementById("card-num");
let cardName = document.getElementById("card-name");
let cardExp = document.getElementById("card-exp");

// input form
let form = document.querySelector("form");
let input = document.querySelectorAll("input:not([type=submit])");
let messages = document.querySelectorAll(".message");

// different state
let submitState = document.querySelector(".input-submit");
let completeState = document.querySelector(".completed");
let error = false;

input[1].addEventListener("keydown", (e) => {
  let num = input[1];
  // add space between every 4 digits in the card number input field
  if (num.value.length >= 4) {
    let arr = num.value.split("");
    let counter = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == " ") {
        continue;
      } else {
        counter++;
      }
      if (
        counter % 4 === 0 &&
        counter !== 16 &&
        arr[i + 1] !== " " &&
        e.key !== "Backspace"
      ) {
        arr.splice(i + 1, 0, " ");
      }
    }
    num.value = arr.join("");
  }
});

// auto add leading 0 for single digit input in expiry month
input[2].addEventListener("blur", () => {
  let expMonth = input[2];
  if (expMonth.value.length === 1) {
    expMonth.value = `0${expMonth.value}`;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // reset error to false before validation
  error = false;

  //clear error in all messages div before validation
  messages.forEach((div) => (div.textContent = ""));

  input.forEach((field, ind) => {
    //remove the red border for error before validation
    field.classList.remove("error");

    // setting the correct message div to the corresponding input
    if (field.name === "exp") {
      ind = 2;
    } else if (field.name === "cvc") {
      ind = 3;
    }

    // check if input field is blank
    if (!field.value) {
      errorMsg(messages[ind], "can't be blank", field);
    } else {
      if (
        field.name === "num" ||
        field.name === "exp" ||
        field.name === "cvc"
      ) {
        //check whether there is any non-number characters; remove space for credit card number
        let result = checkNonNumber(
          field.name === "num" ? field.value.replace(/\s+/g, "") : field.value
        );
        if (result) {
          errorMsg(messages[ind], "wrong format, numbers only", field);
        }

        if (field.name === "exp") {
          //check whether the exp month and exp year contain 2 digits
          if (field.value.length !== 2) {
            errorMsg(messages[ind], "wrong format, must be 2 digits", field);
          }
        }
      }

      //check whether the cvc contains 3 digits
      if (field.name === "cvc" && field.value.length !== 3) {
        errorMsg(messages[ind], "wrong format, must be 3 digits", field);
      }
      if (field.name == "num") {
        let card = field.value.replace(/\s+/g, "");

        // check whether inputed card number contains digits only
        if (/\D+/g.test(card)) {
          errorMsg(messages[ind], "wrong format, numbers only", field);
        }

        // check for credit card number length
        if (card.length < 13 || card.length > 16) {
          errorMsg(messages[ind], "invalid length", field);
        }
      }

      // set the input info to display on card
      if (field.name == "exp") {
        let month = input[2].value || "00";
        let year = input[3].value || "00";
        showOnCard(field, `${month}/${year}`);
      } else {
        showOnCard(field, field.value);
      }
    }
  });
  //check if there are any error messages
  let counter = 0;
  for (let div in messages) {
    if (messages[div].textContent) {
      error = true;
    }
    counter++;
    console.log(messages[div].textContent);
    if (error === false && counter === 4) {
      submitState.style.display = "none";
      completeState.style.display = "flex";
    }
  }
});

const errorMsg = (div, msg, input) => {
  div.textContent = msg;
  input.classList.add("error");
};

const checkNonNumber = (text) => {
  return /\D+/g.test(text);
};

const showOnCard = (input, value) => {
  let field = `card-${input.name}`;
  document.getElementById(`${field}`).textContent = value;
};
