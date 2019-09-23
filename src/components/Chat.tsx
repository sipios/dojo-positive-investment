import './Chart.css';

import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';

const THEME = {
  fontFamily: 'Helvetica Neue',
  textAlign: 'center',
};

const bubbleStyle = {
  textAlign: 'left',
};

interface Props { }

interface ChatData {
  steps: Steps;
}

// TODO : Utiliser ces noms en tant qu'ids des steps des choix de chaque externalité
interface Steps {
  'animals-choice': Step;
  'forest-choice': Step;
  'climate-choice': Step;
  'energy-choice': Step;
  'development-choice': Step;
  'education-choice': Step;
  'risk-choice': Step;
  'investment-choice': Step;
}

interface Step {
  value: number | string;
}

export class Chat extends Component<Props> {
  getFunds = ({ steps }: ChatData) => {
    // TODO : Appeler le moteur de calcul avec les réponses de l'utilisateur !
    return 'step-id';
  };

  render() {
    return (
      <div className="chat">
        <ChatBot
          headerTitle="Positive Investment"
          placeholder="Taper un message"
          width="100%"
          style={THEME}
          bubbleStyle={bubbleStyle}

          // TODO : Ajouter des étapes pour faire parler votre chatbot !
          steps={[]}
        />
      </div>
    );
  }
}
