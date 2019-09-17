import React, { Component } from "react";
import ChatBot from "react-simple-chatbot";

export class Chat extends Component {
  render() {
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
            message: "Faisons connaissance!",
            trigger: "choice"
          },
          {
            id: "choice",
            message: "Which cause is the most important to you?",
            trigger: "choice-user"
          },
          {
            id: "choice-user",
            options: [
              {
                value: 1,
                label: "Promouvoir la race des caniches",
                trigger: "choice-validate"
              },
              {
                value: 2,
                label: "Planter des arbres pour la planète",
                trigger: "choice-validate"
              },
              {
                value: 3,
                label: "Développer les énergies renouvelables",
                trigger: "choice-validate"
              },
              {
                value: 4,
                label: "Sauver les bébés phoques",
                trigger: "choice-validate"
              }
            ]
          },
          {
            id: "choice-validate",
            message: "Bon choix !",
            end: true
          },
        ]}
      />
    );
  }
}
