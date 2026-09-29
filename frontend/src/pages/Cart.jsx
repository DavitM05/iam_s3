import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../store.jsx";
import { money } from "../components/ProductCard.jsx";

export default function Cart() {
  const { cart, setQty, total, clearCart, auth } = useApp();
  const [address, setAddress] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);

  const checkout = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const o = await api("/orders", { method: "POST", token: auth.token, body: { address, items: cart.map((l) => ({ product_id: l.id, qty: l.qty })) } });
      clearCart(); setDone(o);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  if (done) return <div className="panel"><h1>Order #{done.id} placed</h1><p>Total {money(done.total)}. We'll ship to {done.address}.</p><Link to="/orders">See my orders</Link></div>;
  if (!cart.length) return <p className="empty">Your cart is empty. <Link to="/">Find a phone</Link></p>;

  return (
    <div className="cart">
      <h1>Your cart</h1>
      {cart.map((l) => (
        <div className="line" key={l.id}>
          <div><Link to={`/product/${l.id}`}><b>{l.name}</b></Link><div className="muted">{l.storage}</div></div>
          <div className="qty">
            <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Remove one">−</button>
            <span>{l.qty}</span>
            <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Add one">+</button>
          </div>
          <b>{money(l.price * l.qty)}</b>
        </div>
      ))}
      <div className="line total"><span>Total</span><b>{money(total)}</b></div>
      {auth ? (
        <form onSubmit={checkout} className="form">
          <label>Delivery address
            <textarea required minLength={5} value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          {err && <p className="error">{err}</p>}
          <button className="big" disabled={busy}>{busy ? "Placing order…" : "Place order"}</button>
        </form>
      ) : (
        <p><Link to="/login" className="inline-link">Log in</Link> to place your order.</p>
      )}
    </div>
  );
}
