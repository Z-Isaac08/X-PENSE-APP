import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Logo from "../../assets/logo.svg";
import { deleteUser } from "../../services/userHelper";

const NavBar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      toast.success("Compte supprimé avec succès");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    window.location.href = `/h/${user.id}`;
  };

  return (
    <nav className="w-full md:p-10 gap-5 flex-col flex md:flex-row p-5 sm:p-2 text-[hsl(0, 0%, 12%)] items-center justify-between">
      {!user ? (
        <>
          <div className="flex items-center cursor-pointer gap-3">
            <img src={Logo} className="md:h-8 h-6" />
            <p className="md:text-3xl text-xl">
              <span className="text-[#3170dd] font-bold">X</span>pense
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            className="flex items-center cursor-pointer gap-3"
            onClick={handleSubmit}
          >
            <img src={Logo} className="h-8" />
            <p className="md:text-3xl text-xl">
              <span className="text-[#3170dd] font-bold">X</span>pense
            </p>
          </div>
          <button
            className="text-[#e33131] cursor-pointer flex items-center gap-3 w-fit border border-[#e33131] bg-[#e331311a] md:text-base hover:border-none transition-all duration-300 hover:text-white hover:bg-[#e33131] rounded-sm p-2.5 text-sm md:p-3"
            onClick={handleDelete}
          >
            <Trash />
            <span className="font-extralight">Supprimer ce compte</span>
          </button>
        </>
      )}
    </nav>
  );
};

export default NavBar;
