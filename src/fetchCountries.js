const fetchCountries = function (name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages
`).then((response) => {
    if (response.ok === false) {
      Notify.failure('Oops, there is no country with that name');
      return;
    }
    return response.json();
  });
};

export { fetchCountries };
