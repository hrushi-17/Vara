const ITEMS = [
  'HANDCRAFTED LEATHER','GENUINE COW HIDE','MADE IN INDIA',
  'LIFETIME WARRANTY','CORPORATE GIFTING','FREE ENGRAVING',
  'BRASS HARDWARE','VEGETABLE TANNED','SADDLE STITCHED',
];

export default function MarqueeTicker() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">✦ {item}</span>
        ))}
      </div>
    </div>
  );
}
