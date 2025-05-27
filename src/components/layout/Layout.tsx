import Footer from "./Footer";
import NavBar from "./NavBar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <section className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow h-full">{children}</main>
      <Footer />
    </section>
  );
};

export default Layout;
