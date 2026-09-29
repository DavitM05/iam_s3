import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const brand = params.get("brand") || "";
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    setState("loading");
    const t = setTimeout(() => {
      const qs = new URLSearchParams({ ...(brand && { brand }), ...(q && { q }) });
      api(`/products?${qs}`).then((d) => { setItems(d); setState("ok"); }).catch(() => setState("error"));
    }, 250);
    return () => clearTimeout(t);
  }, [brand, q]);

  const setBrand = (b) => setParams(b ? { brand: b } : {});

  return (
    <>
      <section className="hero">
        <h1>Every flagship,<br />one counter.</h1>
        <p>New iPhone and Galaxy phones, sealed, warrantied and shipped in two days.</p>
      </section>
      <section className="tools">
        <div className="tabs">
          {[["", "All phones"], ["Apple", "iPhone"], ["Samsung", "Samsung"]].map(([v, l]) => (
            <button key={l} className={brand === v ? "on" : ""} onClick={() => setBrand(v)}>{l}</button>
          ))}
        </div>
        <input type="search" placeholder="Search phones" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search phones" />
      </section>
      {state === "error" && <p className="empty">Couldn't load phones. Check that the backend is running, then refresh.</p>}
      {state === "ok" && items.length === 0 && <p className="empty">No phones match "{q}". Try another name.</p>}
      <section className="grid">{items.map((p) => <ProductCard key={p.id} p={p} />)}</section>
    </>
  );
}
