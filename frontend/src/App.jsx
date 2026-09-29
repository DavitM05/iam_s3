import { Routes, Route, Link, NavLink, Navigate } from "react-router-dom";
import { useApp } from "./store.jsx";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Cart from "./pages/Cart.jsx";
import { Login, Register } from "./pages/Auth.jsx";
import Orders from "./pages/Orders.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  const { count, auth, logout } = useApp();
  return (
    <>
      <header className="bar">
        <Link to="/" className="logo">slab</Link>
        <nav>
          <NavLink to="/?brand=Apple">iPhone</NavLink>
          <NavLink to="/?brand=Samsung">Samsung</NavLink>
          {auth && <NavLink to="/orders">My orders</NavLink>}
          {auth?.user.is_admin && <NavLink to="/admin">Manage</NavLink>}
        </nav>
        <div className="bar-right">
          {auth ? (
            <>
              <span className="hello">Hi, {auth.user.name.split(" ")[0]}</span>
              <button className="link" onClick={logout}>Log out</button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
          <Link to="/cart" className="cart-pill">Cart <b>{count}</b></Link>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={auth ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/admin" element={auth?.user.is_admin ? <Admin /> : <Navigate to="/" />} />
          <Route path="*" element={<p className="empty">Page not found. <Link to="/">Back to the shop</Link></p>} />
        </Routes>
      </main>
      <footer>© {new Date().getFullYear()} Slab Phone Shop. Demo project.</footer>
    </>
  );
}
