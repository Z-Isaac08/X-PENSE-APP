import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../stores/chatStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useIncomeStore } from "../../stores/incomeStore";
import { useUserStore } from "../../stores/userStore";
import { callOpenRouter } from "./callOpenRouter";

const MessageInput = () => {
  const { user } = useUserStore();
  const { addChat } = useChatStore();
  const { expenses } = useExpenseStore();
  const { incomes } = useIncomeStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !user || isLoading) return;

    setIsLoading(true);

    const userMessage = {
      role: "user" as const,
      content: input,
      date: new Date().toISOString(),
    };

    try {
      await addChat(user.id, userMessage);

      // Calcul des totaux
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      const currentMonthExpenses = expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });
      const currentMonthIncomes = incomes.filter((i) => {
        const d = new Date(i.date);
        return d.getMonth() === month && d.getFullYear() === year;
      });

      const totalExpenses = currentMonthExpenses.reduce(
        (sum, e) => sum + e.amount,
        0
      );
      const totalIncomes = currentMonthIncomes.reduce(
        (sum, i) => sum + i.amount,
        0
      );
      const balance = totalIncomes - totalExpenses;

      // Appel API
      const reply = await callOpenRouter(
        input,
        balance,
        totalIncomes,
        totalExpenses
      );

      // Enregistre la réponse
      const botMessage = {
        role: "assistant" as const,
        content: reply,
        date: new Date().toISOString(),
      };
      await addChat(user.id, botMessage);

      setInput("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-3 items-end"
      >
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 pr-12 rounded-2xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#3170dd] focus:border-transparent transition-all duration-200 min-h-[52px] max-h-32"
            placeholder="Pose une question sur tes finances..."
            rows={1}
            style={{
              height: "auto",
              minHeight: "52px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
            disabled={isLoading}
          />

          {input.length > 0 && (
            <div className="absolute bottom-1 right-14 text-xs text-neutral-400">
              {input.length}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 p-3 rounded-2xl bg-[#3170dd] text-white hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3170dd] focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>

      <div className="flex items-center justify-between mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span>
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </span>
        <span className="hidden sm:inline">
          Assistant IA • Conseils financiers
        </span>
      </div>
    </div>
  );
};

export default MessageInput;
