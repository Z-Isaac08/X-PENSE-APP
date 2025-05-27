import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Illustration from "../assets/illustration.svg";
import { useUserStore } from "../stores/userStore";

const RegisterPage = () => {
  const { addUser } = useUserStore();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") {
      toast.error("Veuillez entrer votre nom.");
      return;
    }

    try {
      await addUser(name);
      toast.success(`Bienvenue ${name}`);
      navigate(`/h`);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <main className="flex md:flex-row flex-col md:items-start items-center justify-center p-9 text-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="flex max-w-full md:max-w-1/2 flex-col text-center md:text-left"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-center md:text-left leading-tight">
          Prenez le contrôle de votre{" "}
          <span className="text-[#3170dd]">djai</span>
        </h1>
        <p className="pt-5 text-base md:text-lg font-light leading-relaxed">
          Avec notre Expense Tracker, suivez vos dépenses facilement, <br />
          établissez des budgets efficaces et optimisez votre gestion
          financière.
        </p>
        <input
          type="text"
          value={name}
          placeholder="Entrez votre nom"
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-6 w-full md:max-w-2/4 h-14 text-center md:text-left rounded border-[1.8px] border-neutral-800/45 bg-transparent px-2 text-lg focus:border-blue-600 focus:outline-none"
        />
        <button
          type="submit"
          className="mt-6 flex items-center md:justify-start justify-center gap-2 rounded w-full md:w-fit bg-neutral-900 px-6 py-2 text-lg text-white cursor-pointer hover:opacity-90 transition-all duration-500 hover:bg-neutral-800"
        >
          <UserPlus />
          <span className="py-2">Commencer</span>
        </button>
      </form>
      <div className="hidden md:flex items-center justify-center flex-1">
        <img
          src={Illustration}
          className="max-w-[450px] h-auto object-contain "
          alt="Illustration"
        />
      </div>
    </main>
  );
};

export default RegisterPage;
