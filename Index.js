const state = {
  transactions: []
};

const transactionFormEl =
  document.getElementById("transactionForm");

/* RENDER */

const renderTransactions = () => {

  const transactionContainerEl =
    document.querySelector(".transactions");

  const netAmountEl =
    document.getElementById("netAmount");

  const earningEl =
    document.getElementById("earning");

  const expenseEl =
    document.getElementById("expense");

  let earning = 0;
  let expense = 0;

  transactionContainerEl.innerHTML = "";

  state.transactions.forEach((transaction) => {

    const { id, text, amount, type } = transaction;

    const isCredit = type === "credit";

    if(isCredit){
      earning += amount;
    }else{
      expense += amount;
    }

    const transactionEl = `

    <div class="transaction"
      onclick="toggleActions(${id})">

      <div class="transaction_top">

        <div class="left">

          <p>${text}</p>

          <p>
            ${isCredit ? "+" : "-"} ₹${amount}
          </p>

        </div>

        <div class="status ${isCredit ? "credit" : "debit"}">
          ${isCredit ? "C" : "D"}
        </div>

      </div>

      <div class="hidden_actions">

        <button
          class="edit_action"
          onclick="event.stopPropagation(); editTransaction(${id})"
        >
          Edit
        </button>

        <button
          class="delete_action"
          onclick="event.stopPropagation(); deleteTransaction(${id})"
        >
          Delete
        </button>

      </div>

    </div>

    `;

    transactionContainerEl
      .insertAdjacentHTML("afterbegin", transactionEl);

  });

  const net = earning - expense;

  netAmountEl.innerHTML = `₹${net}`;
  earningEl.innerHTML = `₹${earning}`;
  expenseEl.innerHTML = `₹${expense}`;
};

/* ADD TRANSACTION */

const addTransaction = (e) => {

  e.preventDefault();

  const isEarn =
    e.submitter.id === "earnBtn";

  const formData =
    new FormData(transactionFormEl);

  const text =
    formData.get("text");

  const amount =
    Number(formData.get("amount"));

  if(text === "" || amount <= 0){

    alert("Please enter valid data");

    return;
  }

  const transaction = {

    id: Date.now(),

    text,

    amount,

    type: isEarn ? "credit" : "debit"

  };

  state.transactions.push(transaction);

  console.log(state.transactions);

  renderTransactions();

  transactionFormEl.reset();
};

/* DELETE */

const deleteTransaction = (id) => {

  state.transactions =
    state.transactions.filter(
      (transaction) => transaction.id !== id
    );

  renderTransactions();
};

/* EDIT */

const editTransaction = (id) => {

  const transaction =
    state.transactions.find(
      (t) => t.id === id
    );

  document.getElementById("text").value =
    transaction.text;

  document.getElementById("amount").value =
    transaction.amount;

  deleteTransaction(id);
};

/* TOGGLE ACTIONS */

const toggleActions = (id) => {

  const allTransactions =
    document.querySelectorAll(".transaction");

  allTransactions.forEach((item) => {

    const editBtn =
      item.querySelector(".edit_action");

    if(editBtn){

      const itemId =
        Number(
          editBtn
          .getAttribute("onclick")
          .match(/\d+/)[0]
        );

      if(itemId === id){
        item.classList.toggle("active");
      }else{
        item.classList.remove("active");
      }

    }

  });

};

renderTransactions();

transactionFormEl.addEventListener(
  "submit",
  addTransaction
);