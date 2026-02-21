import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-slate-50 to-slate-100">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
