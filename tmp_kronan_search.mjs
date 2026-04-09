import fetch from 'node-fetch';

async function searchRecipe(query) {
  const token = 'act_190e4a0f8580e9e5c6e6e8582364f504c0610014';
  const res = await fetch(`https://api.kronan.is/api/v1/recipes/`, {
    headers: {
      Authorization: `AccessToken ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (res.ok) {
     const data = await res.json();
     console.log('Recipes:', data);
  } else {
     console.error('Failed to fetch recipes:', res.status, res.statusText);
  }
}

(async () => {
  await searchRecipe('pizza');
})();
