class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "7f0df622-e052-48ca-afd6-8b05c9131277",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
