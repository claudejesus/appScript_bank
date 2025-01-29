
let balance = 0;
const balanceText = document.getElementById("balanceText");
const statusText = document.getElementById("statusText");
const transactionForm = document.getElementById("transactionForm");

transactionForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const depositAmount = parseFloat(document.getElementById("deposit").value);
    const withdrawalAmount = parseFloat(document.getElementById("withdrawal").value);

    // Update the balance with the deposit
    balance += depositAmount;

    // Check if withdrawal is possible
    if (withdrawalAmount <= balance) {
        balance -= withdrawalAmount;
        statusText.textContent = "Withdrawal successful!";
        statusText.style.color = "green";
    } else {
        statusText.textContent = "Insufficient balance for withdrawal.";
        statusText.style.color = "red";
    }

    // Update the balance text
    balanceText.textContent = "Balance: $" + balance.toFixed(2);
});
