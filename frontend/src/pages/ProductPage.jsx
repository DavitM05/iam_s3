import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../store.jsx";
import PhoneArt from "../components/PhoneArt.jsx";
import { money } from "../components/ProductCard.jsx";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useApp();
  const [p, setP] = useState(null);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => { api(`/products/${id}`).then(setP).catch((e) => setErr(e.message)); }, [id]);
  if (err) return <p className="empty">{err}. <Link to="/">Back to the shop</Link></p>;
  if (!p) return <p className="empty">Loading…</p>;

  return (
    <div className="detail">
      <div className={`detail-art ${p.brand === "Apple" ? "apple" : "samsung"}`}>
        {p.image_url ? <img src={p.image_url} alt={p.name} /> : <PhoneArt brand={p.brand} />}
      </div>
      <div>
        <Link to={`/?brand=${p.brand}`} className="muted">{p.brand === "Apple" ? "iPhone" : "Samsung"}</Link>
        <h1>{p.name}</h1>
        <p className="price">{money(p.price)}</p>
        <p>{p.description}</p>
        <dl>
          <dt>Storage</dt><dd>{p.storage}</dd>
          <dt>Colour</dt><dd>{p.color}</dd>
          <dt>Availability</dt><dd>{p.stock > 0 ? (p.stock < 5 ? `Only ${p.stock} left` : "In stock") : "Sold out"}</dd>
        </dl>
        <button className="big" disabled={p.stock < 1} onClick={() => { addToCart(p); setAdded(true); }}>
          {added ? "Added to cart" : "Add to cart"}
        </button>
        {added && <Link to="/cart" className="inline-link">View cart</Link>}
      </div>
    </div>
  );
}
