import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useApp } from "../store.jsx";
import { money } from "../components/ProductCard.jsx";

export default function Orders() {
  const { auth } = useApp();
  const [orders, setOrders] = useState(null);
  useEffect(() => { api("/orders", { token: auth.token }).then(setOrders).catch(() => setOrders([])); }, [auth]);
  if (!orders) return <p className="empty">Loading…</p>;
  if (!orders.length) return <p className="empty">No orders yet.</p>;
  return (
    <div className="cart">
      <h1>My orders</h1>
      {orders.map((o) => (
        <div className="order" key={o.id}>
          <div className="line"><b>Order #{o.id}</b><span className="muted">{new Date(o.created_at + "Z").toLocaleDateString()} · {o.status}</span><b>{money(o.total)}</b></div>
          {o.items.map((i, k) => <div className="muted" key={k}>{i.qty} × {i.name}</div>)}
        </div>
      ))}
    </div>
  );
}
