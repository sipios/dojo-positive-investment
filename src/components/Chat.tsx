import React, { Component } from "react";
import ChatBot from "react-simple-chatbot";

interface State {
  funds?: any; //to type
  initialInvestment?: number;
}

interface Props {}

const fun = (x: any, y: any) => x; // TO REPLACE BY THE CALL TOWARDS THE ENGINE

export class Chat extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  getFunds = ({ steps }: any) => {
    const userPreferences: any = {
      animals: steps["animals-choice"]["value"],
      forest: steps["forest-choice"]["value"],
      climate: steps["climate-choice"]["value"],
      energy: steps["energy-choice"]["value"],
      education: steps["education-choice"]["value"]
    };

    const volatility = steps["risk-choice"]["value"];
    const initialInvestment = Number(steps["investment-choice"]["value"]);

    this.setState({
      funds: fun(userPreferences, volatility),
      initialInvestment
    });

    return "end";
  };

  render() {
    console.log(this.state);
    return (
      <ChatBot
        steps={[
          {
            id: "intro-1",
            message: "Hey, bienvenue chez Positive Investment ! 😀",
            trigger: "intro-2"
          },
          {
            id: "intro-2",
            message:
              "Nous vous aidons à investir de manière responsable dans les fonds qui comptent pour vous.",
            trigger: "intro-3"
          },
          {
            id: "intro-3",
            message: "Faisons connaissance !",
            trigger: "investment"
          },
          {
            id: "investment",
            message: "Combien voulez-vous investir ?",
            trigger: "investment-choice"
          },
          {
            id: "investment-choice",
            user: true,
            trigger: "risk"
          },
          {
            id: "risk",
            message:
              "Quel risque êtes vous prêt à prendre ? Plus le risque est élevé plus le gain potentiel l'est aussi.",
            trigger: "risk-choice"
          },
          {
            id: "risk-choice",
            options: [
              {
                value: 0.0025,
                label: "Risque élevé",
                trigger: "choice"
              },
              {
                value: 0.0001,
                label: "Risque modéré",
                trigger: "choice"
              },
              {
                value: 0.000025,
                label: "Risque faible",
                trigger: "choice"
              }
            ]
          },
          {
            id: "choice",
            message: "Regardons les thématiques qui vous intéresses.",
            trigger: "animals"
          },
          {
            id: "animals",
            message:
              "Souhaitez vous protéger les animaux ? Que ce soit des caniches ou des chihuahua, ils ont besoin de vous !",
            trigger: "animals-choice"
          },
          {
            id: "animals-choice",
            options: [
              {
                value: -1,
                label: "Non, tuons-les tous 🔫",
                trigger: "forest"
              },
              {
                value: 0,
                label: "Je m'en fiche",
                trigger: "forest"
              },
              {
                value: 1,
                label: "Oui, ils sont tellement mignons 🦆🦜🐩",
                trigger: "forest"
              }
            ]
          },
          {
            id: "forest",
            message:
              "Souhaitez vous protéger les forêts, les poumons de notre planete ?",
            trigger: "forest-choice"
          },
          {
            id: "forest-choice",
            options: [
              {
                value: -1,
                label: "🔥🔥🔥 Brulons-les ! 🔥🔥🔥",
                trigger: "climate"
              },
              {
                value: 0,
                label: "Je m'en fiche",
                trigger: "climate"
              },
              {
                value: 1,
                label: "🌲🌳 Oui, plantons des arbres 🌴🎄",
                trigger: "climate"
              }
            ]
          },
          {
            id: "climate",
            message: "Souhaitez vous agir pour protéger le climat ?",
            trigger: "climate-choice"
          },
          {
            id: "climate-choice",
            options: [
              {
                value: -1,
                label: "🌪🚗🚚 Non, détruisons-le 🏎✈️🔥",
                trigger: "energy"
              },
              {
                value: 0,
                label: "Je m'en fiche",
                trigger: "energy"
              },
              {
                value: 1,
                label:
                  "🚵‍♀🥦 Oui, je veux faire des investissements repsonsable ⛵🌎️️",
                trigger: "energy"
              }
            ]
          },
          {
            id: "energy",
            message: "Souhaitez vous développer les énergies renouvelables?",
            trigger: "energy-choice"
          },
          {
            id: "energy-choice",
            options: [
              {
                value: -1,
                label: "🛢🛢🛢 Non, ca marche bien le pétrole 🛢🛢🛢",
                trigger: "education"
              },
              {
                value: 0,
                label: "Je m'en fiche",
                trigger: "education"
              },
              {
                value: 1,
                label: "⚡️⚡️⚡️ Bien sur, sauvons la planète ️☀️☀️☀️",
                trigger: "education"
              }
            ]
          },
          {
            id: "education",
            message:
              "Souhaitez vous favoriser l'éducation ? Rendre les études accessibles à tous",
            trigger: "education-choice"
          },
          {
            id: "education-choice",
            options: [
              {
                value: -1,
                label:
                  "Non, il parrait que ca sert à rien les maths de toute façon 🤦‍♂️",
                trigger: this.getFunds
              },
              {
                value: 0,
                label: "Je m'en fiche",
                trigger: this.getFunds
              },
              {
                value: 1,
                label: "Yes, Knowledge is power 👩‍🎓👨‍🎓️",
                trigger: this.getFunds
              }
            ]
          },
          {
            id: "end",
            message: "Bon choix !",
            end: true
          }
        ]}
      />
    );
  }
}
