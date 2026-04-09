const token = 'act_190e4a0f8580e9e5c6e6e8582364f504c0610014';
const headers = {
  'Authorization': `AccessToken ${token}`,
  'Content-Type': 'application/json'
};

async function searchProduct(query) {
  const res = await fetch('https://api.kronan.is/api/v1/products/search/', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, limit: 3, with_detail: true })
  });
  if (!res.ok) {
    console.error('Error fetching', query, res.status);
    return;
  }
  const data = await res.json();
  console.log(`\n--- Results for: ${query} ---`);
  if (data.results) {
    data.results.forEach(p => {
      console.log(`[${p.sku}] ${p.name}`);
    });
  } else if (data.items) {
    data.items.forEach(p => {
      console.log(`[${p.sku || p.id}] ${p.name || p.title}`);
    });
  } else {
    console.log(data);
  }
}

(async () => {
  await searchProduct('prosciutto');
  await searchProduct('parmaskinka');
})();
