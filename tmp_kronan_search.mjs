async function getProductBySku(sku) {
  const token = 'act_190e4a0f8580e9e5c6e6e8582364f504c0610014';
  const res = await fetch(`https://api.kronan.is/api/v1/products/${sku}/`, {
    headers: {
      Authorization: `AccessToken ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (res.ok) {
     const data = await res.json();
     console.log(`[${sku}] Success -> Price: ${data.price}, Name: ${data.name}`);
  } else {
     console.error(`[${sku}] Failed: ${res.status}`);
  }
}

(async () => {
  await getProductBySku('100262103');
})();
