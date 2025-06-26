import { useState } from "react";
import Table from "../components/table/Table";
import { useExpenseStore } from "../stores/expenseStore";
import { useIncomeStore } from "../stores/incomeStore";

const TransactionPage = () => {
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");

  const lowerSearch = search.toLowerCase();

  const filteredExpenses = expenses.filter((e) =>
    e.name.toLowerCase().includes(lowerSearch)
  );
  const filteredIncomes = incomes.filter((i) =>
    i.name.toLowerCase().includes(lowerSearch)
  );

  const displayedExpenses =
    filter === "all" || filter === "expense" ? filteredExpenses : [];
  const displayedIncomes =
    filter === "all" || filter === "income" ? filteredIncomes : [];

  return (
    <main className="min-h-screen px-6 py-8 space-y-8 md:px-16 text-[#1f1f1f] dark:text-neutral-100 transition-colors duration-500">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Transactions</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou catégorie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border px-4 py-2 rounded focus:outline-none focus:border-none focus:ring-2 focus:ring-[#3170dd] bg-white dark:bg-neutral-800"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded border ${
              filter === "all" ? "bg-[#3170dd] text-white" : "bg-transparent"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-4 py-2 rounded border ${
              filter === "expense"
                ? "bg-[#3170dd] text-white"
                : "bg-transparent"
            }`}
          >
            Dépenses
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-4 py-2 rounded border ${
              filter === "income" ? "bg-[#3170dd] text-white" : "bg-transparent"
            }`}
          >
            Revenus
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Table expenses={displayedExpenses} incomes={displayedIncomes} />
      </div>
    </main>
  );
};

export default TransactionPage;
