const SHIPPING_REGIONS = {
  southeast: { prefixes: ["0", "1", "2", "3"], factor: 1, days: [2, 5] },
  south: { prefixes: ["8", "9"], factor: 1.12, days: [3, 6] },
  centralWest: { prefixes: ["7"], factor: 1.2, days: [3, 7] },
  northeast: { prefixes: ["4", "5", "6"], factor: 1.35, days: [4, 8] },
};

export const calculateShippingOptions = (cep, subtotal) => {
  const firstDigit = String(cep || "").replace(/\D/g, "").charAt(0);
  const region = Object.values(SHIPPING_REGIONS).find(({ prefixes }) => prefixes.includes(firstDigit));
  const { factor, days } = region || { factor: 1.45, days: [5, 10] };
  const handling = subtotal >= 500 ? 0 : 6.5;
  const price = (base) => Math.round((base * factor + handling) * 100) / 100;

  return [
    { id: 1, label: "Expressa (Sedex)", desc: `Receba em até ${days[0]} dias úteis`, price: price(39.9) },
    { id: 2, label: "Econômica (PAC)", desc: `Receba em até ${days[1]} dias úteis`, price: price(19.9) },
  ];
};
