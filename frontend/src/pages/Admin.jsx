import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useApp } from "../store.jsx";
import { money } from "../components/ProductCard.jsx";

const blank = { name: "", brand: "Apple", price: "", storage: "", color: "", description: "", image_url: "", stock: 10 };

export default function Admin() {
  const { auth } = useApp();
  const [items, setItems] = useState([]);
  const [f, setF] = useState(blank);
  const [err, setErr] = useState("");
  const load = () => api("/products").then(setItems);
  useEffect(() => { load(); }, []);
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const add = async (e) => {
    e.preventDefault(); setErr("");
    try {
      await api("/products", { method: "POST", token: auth.token, body: { ...f, price: Number(f.price), stock: Number(f.stock) } });
      setF(blank); load();
    } catch (e) { setErr(e.message); }
  };
  const del = async (id) => { await api(`/products/${id}`, { method: "DELETE", token: auth.token }); load(); };

  return (
    <div className="cart">
      <h1>Manage phones</h1>
      <form className="form admin-form" onSubmit={add}>
        <input required placeholder="Name" value={f.name} onChange={on("name")} />
        <select value={f.brand} onChange={on("brand")}><option>Apple</option><option>Samsung</option></select>
        <input required type="number" min="1" step="0.01" placeholder="Price" value={f.price} onChange={on("price")} />
        <input placeholder="Storage" value={f.storage} onChange={on("storage")} />
        <input placeholder="Colour" value={f.color} onChange={on("color")} />
        <input type="number" min="0" placeholder="Stock" value={f.stock} onChange={on("stock")} />
        <input placeholder="Image URL (optional)" value={f.image_url} onChange={on("image_url")} />
        <input placeholder="Description" value={f.description} onChange={on("description")} />
        {err && <p className="error">{err}</p>}
        <button className="big">Add phone</button>
      </form>
      {items.map((p) => (
        <div className="line" key={p.id}>
          <div><b>{p.name}</b> <span className="muted">{p.brand}, {p.storage}</span></div>
          <span className="muted">{p.stock} in stock</span>
          <span>{money(p.price)} <button className="link danger" onClick={() => del(p.id)}>Delete</button></span>
        </div>
      ))}
    </div>
  );
}
