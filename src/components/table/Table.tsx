import { Trash } from "lucide-react";
import { toast } from "react-toastify";
import { deleteExpense } from "../../services/expenseHelper";

const Table = ({ expenses, onTable }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async (id) => {
    try {
      await deleteExpense(user.id, id);
      toast.success("Dépense supprimée");
      if (onTable) onTable();
    } catch (error) {
      toast.error("Échec lors de la suppression");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg text-sm sm:text-base">
        <thead>
          <tr className="bg-[#3170dd] text-white">
            <th className="text-left px-4 py-3">Nom</th>
            <th className="text-left px-4 py-3">Montant</th>
            <th className="text-left px-4 py-3">Catégorie</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-center px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="border-b last:border-b-2 border-blue-600 even:bg-blue-50"
            >
              <td className="px-4 py-2">{expense.name}</td>
              <td className="px-4 py-2">{expense.amount}</td>
              <td className="px-4 py-2">{expense.budget}</td>
              <td className="px-4 py-2">{expense.date}</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="text-red-600 hover:text-red-800 transition"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
