import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../stores/chatStore";
import { useUserStore } from "../../stores/userStore";

const MessageInput = () => {
  const { user } = useUserStore();
  const { sendMessage, isLoading } = useChatStore();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim() || !user || isLoading) return;

    const message = input.trim();
    setInput(""); // Vider l'input immédiatement

    try {
      await sendMessage(message, user.id);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
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
