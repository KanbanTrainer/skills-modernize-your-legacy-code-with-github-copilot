# COBOL Program Documentation

This directory documents the COBOL account-management program in `src/cobol/`. The current implementation keeps one account balance; it does not store student profiles or distinguish accounts by student.

## COBOL files

| File | Purpose | Key functions |
|---|---|---|
| `main.cob` (`MainProgram`) | Interactive entry point and menu loop. | Displays the menu, accepts a choice, dispatches view, credit, and debit requests to `Operations`, and exits when the user selects 4. Invalid menu choices display an error and return to the menu. |
| `operations.cob` (`Operations`) | Implements balance viewing and account transactions. | `TOTAL ` reads and displays the current balance; `CREDIT` accepts an amount, adds it, stores the result, and displays the new balance; `DEBIT ` accepts an amount and subtracts it only when funds are sufficient. |
| `data.cob` (`DataProgram`) | Holds the in-memory balance and provides read/write access to it. | `READ` copies the stored balance to the caller; `WRITE` replaces the stored balance with the caller's value. The stored balance starts at 1,000.00 and is not saved to a file or database. |

## Student-account business rules

- The program manages a single balance, initially 1,000.00, represented with two decimal places.
- A credit increases the balance by the entered amount and updates the in-memory balance for the current program run.
- A debit is applied only if the current balance is greater than or equal to the entered amount. Otherwise, the program reports insufficient funds and leaves the balance unchanged.
- The source does not validate that transaction amounts are positive, nor does it define a student identity, account status, eligibility criteria, fees, or student-specific limits. Those rules should not be assumed to exist.

## Application data flow

```mermaid
sequenceDiagram
	actor User
	participant Main as MainProgram
	participant Ops as Operations
	participant Data as DataProgram

	loop Until the user selects 4
		Main->>User: Display menu
		User->>Main: Enter menu choice
		alt Choice 1: view balance
			Main->>Ops: CALL TOTAL
			Ops->>Data: CALL READ with balance
			Data-->>Ops: Copy stored balance to caller
			Ops-->>User: Display current balance
		else Choice 2: credit account
			Main->>Ops: CALL CREDIT
			Ops->>User: Prompt for credit amount
			User-->>Ops: Enter amount
			Ops->>Data: CALL READ with balance
			Data-->>Ops: Copy stored balance to caller
			Ops->>Ops: Add amount to balance
			Ops->>Data: CALL WRITE with updated balance
			Data-->>Ops: Store updated balance
			Ops-->>User: Display new balance
		else Choice 3: debit account
			Main->>Ops: CALL DEBIT
			Ops->>User: Prompt for debit amount
			User-->>Ops: Enter amount
			Ops->>Data: CALL READ with balance
			Data-->>Ops: Copy stored balance to caller
			alt Balance is at least the debit amount
				Ops->>Ops: Subtract amount from balance
				Ops->>Data: CALL WRITE with updated balance
				Data-->>Ops: Store updated balance
				Ops-->>User: Display new balance
			else Insufficient funds
				Ops-->>User: Display insufficient funds message
			end
		else Invalid menu choice
			Main-->>User: Display invalid choice message
		end
	end
	Main-->>User: Display exit message
```
