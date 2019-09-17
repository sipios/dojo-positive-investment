// pass your JSON/JavaScript object to `.talk()` function where
// you define how the conversation between the bot and user will go
export const CONVERSATION = {
  // "ice" (as in "breaking the ice") is a required conversation object
  // that maps the first thing the bot will say to the user
  "ice": {
    // "says" defines an array of sequential bubbles
    // that the bot will produce
    "says": [
      "Hey, bienvenue chez Positive Investment ! 😀",
      "Nous vous aidons à investir de manière responsable dans les fonds qui comptent pour vous.",
      "Faisons connaissance !"
    ],
    // "reply" is an array of possible options the user can pick from
    // as a reply
    "reply": [
      {
        "question": "Cest parti !",
        "answer": "choose-project"
      }
    ]
  },
  "choose-project": {
    "says": [
      "Quel cause vous tient à coeur ?"
    ],
    "reply": [
      {
        "question": "Promouvoir la race des caniches",  // label for the reply option
        "answer": "poodle",  // key for the next conversation object
      },
      {
        "question": "Planter des arbres pour la planète",
        "answer": "continue-project",
      },
      {
        "question": "Développer les énergies renouvelables",
        "answer": "continue-project",
      },
      {
        "question": "Sauver les bébés phoques",
        "answer": "continue-project",
      },
    ]
  },
  // end required "ice" conversation object
  // another conversation object that can be queued from within
  // any other conversation object, including itself
  "continue-project": {
    "says": ["Quel bon coeur !", "Y a-t-il d'autres projet qui vous intéressent ?"],
    "reply": [
      {
        "question": "Oui !",
        "answer": "choose-project"
      },
      {
        "question": "Non, pas vraiment",
        "answer": "order-projects"
      }
    ]
  }, // end conversation object
  "order-projects": {
    "says": [
      "Voici la liste de vos projets",
    ]
  },
  "result": {
    "says": [
      "Voilà vos résultats",
      "<img src=https://media.giphy.com/media/xUOxeXsWhw6DCW1cSA/giphy.gif>"
    ],
    "reply": [
      {
        "question": "Je recommence !",
        "answer": "ice"
      }
    ]
  },
  // bonus
  "poodle": {
    "says": [
      "Vous avez bien raison, les caniches sont des espèces très menacées et notre devoir est de les protéger",
      "....."
    ],
    "reply": [
      {
        "question": "Je recommence !",
        "answer": "ice"
      }
    ]
  },
}; // end conversation object
