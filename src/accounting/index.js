const readline = require('node:readline');

const MAX_BALANCE = 99999999; // 999,999.99 in cents
let storedBalance = 100000;   // 1,000.00 in cents

const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
const lines = input[Symbol.asyncIterator]();

async function prompt(message) {
  console.log(message);
  const { value, done } = await lines.next();
  return done ? null : value.trim();
}

function parseAmount(value) {
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}

function displayBalance(cents) {
  return (cents / 100).toFixed(2);
}

async function transact(type) {
  const entry = await prompt(`Enter ${type} amount: `);
  if (entry === null) return false;

  const amount = parseAmount(entry);
  if (amount === null) {
    console.log('Invalid amount.');
  } else if (type === 'credit') {
    if (storedBalance + amount > MAX_BALANCE) {
      console.log('Amount exceeds balance limit.');
    } else {
      storedBalance += amount;
      console.log(`Amount credited. New balance: ${displayBalance(storedBalance)}`);
    }
  } else if (storedBalance >= amount) {
    storedBalance -= amount;
    console.log(`Amount debited. New balance: ${displayBalance(storedBalance)}`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
  return true;
}

async function main() {
  let running = true;
  while (running) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choice = await prompt('Enter your choice (1-4): ');
    switch (choice) {
      case '1':
        console.log(`Current balance: ${displayBalance(storedBalance)}`);
        break;
      case '2':
        running = await transact('credit');
        break;
      case '3':
        running = await transact('debit');
        break;
      case '4':
      case null:
        running = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
  console.log('Exiting the program. Goodbye!');
  input.close();
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
  input.close();
});
