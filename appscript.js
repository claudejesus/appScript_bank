const sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/11mEXJw6SBrvQaLiH5xOaPwZmvJwfnp6SIi-uBUQxhcc/edit?gid=0");
const dataSheet = sheet.getSheetByName("Sheet1");

function doPost(e) {
  if (!e || !e.parameter) return ContentService.createTextOutput("Invalid request.");

  const data = e.parameter;
  const user = data.user;
  let transactionType = data.transactionType.trim().toLowerCase();
  const amount = parseFloat(data.amount);

  if (!user || isNaN(amount) || amount <= 0) {
    return ContentService.createTextOutput("Invalid input. Please enter a valid user and amount.");
  }

  transactionType = transactionType.charAt(0).toUpperCase() + transactionType.slice(1);
  let lastBalance = getLastBalance(user) || 0;

  let newBalance = transactionType === "Deposit" ? lastBalance + amount : lastBalance - amount;

  if (transactionType === "Withdraw" && amount > lastBalance) {
    return ContentService.createTextOutput("Insufficient balance.");
  }

  dataSheet.appendRow([
    user,
    transactionType === "Deposit" ? amount : 0,  
    transactionType === "Withdraw" ? amount : 0,
    newBalance
  ]);

  return ContentService.createTextOutput("Transaction successful! New balance: " + newBalance);
}

// Fetch last balance
function getLastBalance(user) {
  const data = dataSheet.getDataRange().getValues();
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i][0] === user) {
      return parseFloat(data[i][3]);
    }
  }
  return null;
}

// API to return balances
function doGet(e) {
  if (e.parameter.action === "getBalances") {
    const data = dataSheet.getDataRange().getValues();
    let balances = {};

    data.forEach(row => {
      const user = row[0];
      const balance = parseFloat(row[3]);
      balances[user] = balance;
    });

    return ContentService.createTextOutput(JSON.stringify(balances)).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput("Invalid request.");
}
