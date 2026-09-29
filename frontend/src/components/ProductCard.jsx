import { Link } from "react-router-dom";
import PhoneArt from "./PhoneArt.jsx";
import { useApp } from "../store.jsx";

export const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function ProductCard({ p }) {
  const { addToCart } = useApp();
  return (
    <article className={`card ${p.brand === "Apple" ? "apple" : "samsung"}`}>
      <Link to={`/product/${p.id}`} className="card-art">
        {p.image_url ? <img src={p.image_url} alt={p.name} /> : <PhoneArt brand={p.brand} />}
      </Link>
      <div className="card-body">
        <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
        <p className="muted">{[p.storage, p.color].filter(Boolean).join(", ")}</p>
        <div className="card-foot">
          <strong>{money(p.price)}</strong>
          {p.stock > 0 ? <button onClick={() => addToCart(p)}>Add to cart</button> : <span className="muted">Sold out</span>}
        </div>
      </div>
    </article>
  );
}
