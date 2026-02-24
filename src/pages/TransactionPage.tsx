import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Filter, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import Table from '../components/table/Table';
import { useExpenseStore } from '../stores/expenseStore';
import { useIncomeStore } from '../stores/incomeStore';
import { formatCurrency } from '../utils';

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

const TransactionPage = () => {
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfMonth(subMonths(new Date(), 1)),
    endDate: endOfMonth(new Date()),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'thisMonth' | 'lastMonth' | 'custom'>(
    'thisMonth'
  );

  // Fonction pour formater la plage de dates
  const formattedDateRange = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return 'Toutes les dates';
    return `${format(dateRange.startDate, 'd MMM yyyy', { locale: fr })} - ${format(dateRange.endDate, 'd MMM yyyy', { locale: fr })}`;
  }, [dateRange]);

  // Gestion des périodes prédéfinies
  const handlePeriodChange = (period: 'thisMonth' | 'lastMonth' | 'custom') => {
    setSelectedPeriod(period);
    const today = new Date();

    if (period === 'thisMonth') {
      setDateRange({
        startDate: startOfMonth(today),
        endDate: endOfMonth(today),
      });
    } else if (period === 'lastMonth') {
      const firstDayLastMonth = startOfMonth(subMonths(today, 1));
      setDateRange({
        startDate: firstDayLastMonth,
        endDate: endOfMonth(firstDayLastMonth),
      });
    }
    // Pour 'custom', on ne change pas la dateRange, l'utilisateur la définira manuellement
  };

  // Filtrer et trier les transactions
  const { filteredExpenses, filteredIncomes, totalExpenses, totalIncomes } = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    const filterBySearch = <T extends { name: string; date: string }>(items: T[]) =>
      items.filter(
        item =>
          item.name.toLowerCase().includes(lowerSearch) &&
          (!dateRange.startDate || new Date(item.date) >= dateRange.startDate) &&
          (!dateRange.endDate || new Date(item.date) <= dateRange.endDate)
      );

    let exp = filterBySearch(expenses);
    let inc = filterBySearch(incomes);

    // Trier les transactions
    const sorter = <T extends { date: string; amount: number }>(a: T, b: T) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // Tri par montant
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
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
      totalIncomes: totalInc,
    };
  }, [search, expenses, incomes, dateRange, sortBy, sortOrder]);

  const displayedExpenses = filter === 'all' || filter === 'expense' ? filteredExpenses : [];
  const displayedIncomes = filter === 'all' || filter === 'income' ? filteredIncomes : [];
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

      {/* Filtres de période - Restored for better UX */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handlePeriodChange('thisMonth')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
            selectedPeriod === 'thisMonth'
              ? 'bg-[#3170dd] text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
        >
          CE MOIS
        </button>
        <button
          onClick={() => handlePeriodChange('lastMonth')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
            selectedPeriod === 'lastMonth'
              ? 'bg-[#3170dd] text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
        >
          MOIS DERNIER
        </button>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Dépenses
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {formatCurrency(totalExpenses)}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Revenus
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(totalIncomes)}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
            Solde
          </div>
          <div
            className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {formatCurrency(balance)}
          </div>
        </div>
      </div>

      {/* Barre de contrôle */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#3170dd] transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => {
                  setSelectedPeriod('custom');
                  setShowDatePicker(!showDatePicker);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  selectedPeriod === 'custom'
                    ? 'bg-[#3170dd] text-white border-[#3170dd]'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{formattedDateRange}</span>
                </div>
                <Filter size={14} className="opacity-50" />
              </button>

              {showDatePicker && (
                <div className="absolute z-20 mt-2 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 w-full sm:w-80 right-0 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Du
                      </label>
                      <input
                        type="date"
                        value={dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : ''}
                        onChange={e =>
                          setDateRange(prev => ({
                            ...prev,
                            startDate: e.target.value ? new Date(e.target.value) : null,
                          }))
                        }
                        className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Au
                      </label>
                      <input
                        type="date"
                        value={dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : ''}
                        onChange={e =>
                          setDateRange(prev => ({
                            ...prev,
                            endDate: e.target.value ? new Date(e.target.value) : null,
                          }))
                        }
                        className="w-full p-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 font-medium"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full px-4 py-2.5 bg-[#3170dd] hover:bg-[#2659c0] text-white rounded-xl font-semibold transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex-1 sm:flex-initial">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={e => {
                  const [sort, order] = e.target.value.split('-') as [
                    'date' | 'amount',
                    'asc' | 'desc',
                  ];
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="w-full appearance-none pl-4 pr-10 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3170dd] bg-white dark:bg-neutral-900 cursor-pointer transition-all"
              >
                <option value="date-desc">Plus récents</option>
                <option value="date-asc">Plus anciens</option>
                <option value="amount-desc">Montants ↑</option>
                <option value="amount-asc">Montants ↓</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
                <Filter size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mr-2">
            Filtrer par :
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filter === 'all'
                ? 'bg-[#3170dd] text-white shadow-md shadow-blue-500/20'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            TOUTES
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filter === 'expense'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
            }`}
          >
            DÉPENSES
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filter === 'income'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
            }`}
          >
            REVENUS
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
