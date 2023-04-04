document.getElementById("message-form").addEventListener("submit", function(event) {
    event.preventDefault();
    var input = document.getElementById("pseudo");
    var pseudo = input.value;
    alert("Votre pseudo : " + pseudo);
  });