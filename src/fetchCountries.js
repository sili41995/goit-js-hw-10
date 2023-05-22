export { fetchCountries };

function fetchCountries(searchQuery) {
  const URL = `https://restcountries.com/v3.1/name/${searchQuery}`;

  const searchParams = new URLSearchParams({
    fields: 'name,capital,population,flags,languages',
  });

  return fetch(`${URL}?${searchParams}`).then((response) => {
    if (!response.ok) {
      clearMarkup();
      throw new Error();
    }
    return response.json();
  });
}
