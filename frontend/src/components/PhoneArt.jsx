// Drawn phone silhouette used when a product has no image_url.
export default function PhoneArt({ brand, className = "" }) {
  const apple = brand === "Apple";
  return (
    <svg viewBox="0 0 120 220" className={`phone-art ${className}`} aria-hidden="true">
      <rect x="10" y="4" width="100" height="212" rx="20" fill={apple ? "#1c2530" : "#232a3d"} />
      <rect x="16" y="10" width="88" height="200" rx="15" fill={apple ? "#c9d7e8" : "#cfe0d6"} />
      {apple ? <rect x="44" y="16" width="32" height="9" rx="4.5" fill="#1c2530" /> : <circle cx="60" cy="20" r="4" fill="#232a3d" />}
      <text x="60" y="118" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1c2530" opacity=".55">{apple ? "iPhone" : "Galaxy"}</text>
    </svg>
  );
}
