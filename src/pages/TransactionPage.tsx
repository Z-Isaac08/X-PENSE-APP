import { useState, useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { fr } from 'date-fns/locale';
import { Calendar, Filter, Search } from "lucide-react";
import Table from "../components/table/Table";
import { useExpenseStore } from "../stores/expenseStore";
import { useIncomeStore } from "../stores/incomeStore";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

const TransactionPage = () => {
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfMonth(subMonths(new Date(), 1)),
    endDate: endOfMonth(new Date())
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'thisMonth' | 'lastMonth' | 'custom'>('thisMonth');

  // Fonction pour formater la plage de dates
  const formattedDateRange = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return "Toutes les dates";
    return `${format(dateRange.startDate, 'd MMM yyyy', { locale: fr })} - ${format(dateRange.endDate, 'd MMM yyyy', { locale: fr })}`;
  }, [dateRange]);

  // Gestion des périodes prédéfinies
  const handlePeriodChange = (period: 'thisMonth' | 'lastMonth' | 'custom') => {
    setSelectedPeriod(period);
    const today = new Date();
    
    if (period === 'thisMonth') {
      setDateRange({
        startDate: startOfMonth(today),
        endDate: endOfMonth(today)
      });
    } else if (period === 'lastMonth') {
      const firstDayLastMonth = startOfMonth(subMonths(today, 1));
      setDateRange({
        startDate: firstDayLastMonth,
        endDate: endOfMonth(firstDayLastMonth)
      });
    }
    // Pour 'custom', on ne change pas la dateRange, l'utilisateur la définira manuellement
  };

  // Filtrer et trier les transactions
  const { filteredExpenses, filteredIncomes, totalExpenses, totalIncomes } = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    
    const filterBySearch = <T extends { name: string; date: string }>(items: T[]) => 
      items.filter(item => 
        item.name.toLowerCase().includes(lowerSearch) &&
        (!dateRange.startDate || new Date(item.date) >= dateRange.startDate) &&
        (!dateRange.endDate || new Date(item.date) <= dateRange.endDate)
      );

    let exp = filterBySearch(expenses);
    let inc = filterBySearch(incomes);

    // Trier les transactions
    const sorter = <T extends { date: string; amount: number }>(a: T, b: T) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Tri par montant
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
      }
    };

    exp.sort(sorter);
    inc.sort(sorter);

    // Calculer les totaux
    const totalExp = exp.reduce((sum, e) => sum + e.amount, 0);
    const totalInc = inc.reduce((sum, i) => sum + i.amount, 0);

    return {
      filteredExpenses: exp,
      filteredIncomes: inc,
      totalExpenses: totalExp,
      totalIncomes: totalInc
    };
  }, [search, expenses, incomes, dateRange, sortBy, sortOrder]);

  const displayedExpenses = filter === "all" || filter === "expense" ? filteredExpenses : [];
  const displayedIncomes = filter === "all" || filter === "income" ? filteredIncomes : [];
  const balance = totalIncomes - totalExpenses;

  return (
    <main className="min-h-screen px-4 py-6 space-y-6 md:px-8 lg:px-12 text-[#1f1f1f] dark:text-neutral-100 transition-colors duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gérez et suivez toutes vos transactions
          </p>
        </div>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Dépenses</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalExpenses.toFixed(0)} FCFA</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Revenus</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalIncomes.toFixed(0)} FCFA</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Solde</div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {balance.toFixed(0)} FCFA
          </div>
        </div>
      </div>

      {/* Filtres de période */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handlePeriodChange('thisMonth')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedPeriod === 'thisMonth'
              ? 'bg-[#3170dd] text-white'
              : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700'
          }`}
        >
          Ce mois-ci
        </button>
        <button
          onClick={() => handlePeriodChange('lastMonth')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedPeriod === 'lastMonth'
              ? 'bg-[#3170dd] text-white'
              : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700'
          }`}
        >
          Le mois dernier
        </button>
        <button
          onClick={() => {
            setSelectedPeriod('custom');
            setShowDatePicker(true);
          }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedPeriod === 'custom'
              ? 'bg-[#3170dd] text-white'
              : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700'
          }`}
        >
          Période personnalisée
        </button>
      </div>

      {/* Barre de contrôle */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-neutral-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3170dd] focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="relative">
                <button
                  onClick={() => {
                    setSelectedPeriod('custom');
                    setShowDatePicker(!showDatePicker);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                    selectedPeriod === 'custom'
                      ? 'bg-[#3170dd] text-white border-transparent'
                      : 'bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Calendar size={16} />
                  {formattedDateRange}
                </button>
                
                {showDatePicker && (
                  <div className="absolute z-10 mt-2 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Du
                        </label>
                        <input
                          type="date"
                          value={dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : ''}
                          onChange={(e) => setDateRange(prev => ({
                            ...prev,
                            startDate: e.target.value ? new Date(e.target.value) : null
                          }))}
                          className="w-full p-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Au
                        </label>
                        <input
                          type="date"
                          value={dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : ''}
                          onChange={(e) => setDateRange(prev => ({
                            ...prev,
                            endDate: e.target.value ? new Date(e.target.value) : null
                          }))}
                          className="w-full p-2 border rounded-md dark:bg-neutral-700 dark:border-neutral-600"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 bg-[#3170dd] text-white rounded-md hover:bg-[#2659c0]"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-') as ["date" | "amount", "asc" | "desc"];
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3170dd] focus:border-transparent bg-white dark:bg-neutral-700"
              >
                <option value="date-desc">Date (récent au + ancien)</option>
                <option value="date-asc">Date (ancien au + récent)</option>
                <option value="amount-desc">Montant (décroissant)</option>
                <option value="amount-asc">Montant (croissant)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "all" 
                ? "bg-[#3170dd] text-white" 
                : "bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-neutral-600"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter("expense")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "expense"
                ? "bg-red-500 text-white"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
            }`}
          >
            Dépenses
          </button>
          <button
            onClick={() => setFilter("income")}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "income"
                ? "bg-green-500 text-white"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
            }`}
          >
            Revenus
          </button>
        </div>
      </div>

      {/* Tableau des transactions */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table 
            expenses={displayedExpenses} 
            incomes={displayedIncomes} 
            showCategory={true}
            showActions={true}
          />
        </div>
      </div>
    </main>
  );
};

export default TransactionPage;
