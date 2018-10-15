var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    decks: [],
    selected: "",
    cards: []
  },
  methods: {
    getDeckNamesAndIds: async function() {
      app.decks = callAnkiConnect("deckNamesAndIds");
    },
    getCardsOfDeck: async function(deckName) {
      app.cards = callAnkiConnect("findCards", {
        query: "deck:" + deckName
      });
    }
  }
});

const callAnkiConnect = async function(action, params = {}) {
  app.message = "calling " + action + " with params" + params;
  try {
    const result = await ankiConnectInvoke(action, 6, params);
    console.log(`got ` + action + ` result : ${result}`);
    return result;
  } catch (e) {
    console.log(`error doing ` + action + `: ${e}`);
  }
};
const ankiConnectInvoke = async function(action, version, params = {}) {
  return new Promise((resolve, reject) => {
    /* Use in debugger 
            var XMLHttpRequest = equire("xmlhttprequest").XMLHttpRequest;
            /* */
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("error", () =>
      reject("failed to connect to AnkiConnect")
    );
    xhr.addEventListener("load", () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          throw response.error;
        } else {
          if (response.hasOwnProperty("result")) {
            resolve(response.result);
          } else {
            reject("failed to get results from AnkiConnect");
          }
        }
      } catch (e) {
        reject(e);
      }
    });

    xhr.open("POST", "http://127.0.0.1:8765");
    xhr.send(JSON.stringify({ action, version, params }));
  });
};

const getDueCardsOfDeck = async function(deckName) {
  app.message = "calling getDeckNamesAndIds: " + deckName;
  try {
    const result = await ankiConnectInvoke("areDue", 6, deckName);
    console.log(`got list of decks and ids: ${result}`);
    app.cards = result;
  } catch (e) {
    console.log(`error getting decks: ${e}`);
  }
};
