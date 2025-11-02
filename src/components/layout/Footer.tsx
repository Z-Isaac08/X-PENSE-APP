const Footer = () => {
  return (
    <footer className="bg-[rgba(49,113,222,0.03)] w-full py-3.5 text-[#1f1f1f] dark:text-neutral-100 text-center">
      <div className="text-sm">
        &copy; {new Date().getFullYear()} Isaac N'cho. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
