import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';

import './Chart.css';

import computationEngine from '../computationEngine/engine';

import { ExternalityName, Response } from '../types/types';
import { UserChoice } from '../types/types';
import { DoughnutChart } from './DoughnutChart';
import { LineChart } from './LineChart';

const THEME = {
  fontFamily: 'Helvetica Neue',
  textAlign: 'center',
};

const bubbleStyle = {
  textAlign: 'left',
};

interface State {
  resultData?: Response;
  initialInvestment: number;
};

interface ChatData {
  steps: Steps;
}

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

export class Chat extends Component<{}, State> {
  state = {
    initialInvestment: 0,
    resultData: {
      total: {
        rateReturn: 10,
        standardDeviation: 10,
      },
      graph: {
        years: [2019, 2020, 2021, 2022, 2023],
        meanEvolution: [10, 10, 10, 10, 10],
        optimisticEvolution: [7, 8, 5, 6, 7],
        pessimisticEvolution: [12, 13, 14, 13, 12],
      },
      portfolioContent: [
        {
          fund: {
            isin: '001',
            name: 'fond 1',
            history: [],
            externalities: [],
            description: 'Fond 1 desc',
          },
          weight: 0.5,
        },
      ],
    },
  };

  getFunds = ({ steps }: ChatData) => {
    const userPreferences: UserChoice = {
      [ExternalityName.ANIMAL]: Number(steps['animals-choice']['value']),
      [ExternalityName.FOREST]: Number(steps['forest-choice']['value']),
      [ExternalityName.CLIMATE]: Number(steps['climate-choice']['value']),
      [ExternalityName.ENERGY]: Number(steps['energy-choice']['value']),
      [ExternalityName.DEVELOPMENT]: Number(steps['development-choice']['value']),
      [ExternalityName.EDUCATION]: Number(steps['education-choice']['value']),
    };

    const volatility = Number(steps['risk-choice']['value']);
    const initialInvestment = Number(steps['investment-choice']['value']);

    this.setState({
      resultData: computationEngine(userPreferences, volatility, initialInvestment),
    });

    return 'loading';
  };

  render() {
    console.log(this.state.resultData);
    return (
      <div className="chat">
        <ChatBot
          headerTitle="Positive Investment"
          placeholder="Taper un message"
          width="100%"
          style={THEME}
          bubbleStyle={bubbleStyle}
          steps={[
            {
              id: 'intro-1',
              message: 'Hey, bienvenue chez Positive Investment ! 😀',
              trigger: 'intro-2',
            },
            {
              id: 'intro-2',
              message: 'Nous vous aidons à investir de manière responsable dans les fonds qui comptent pour vous.',
              trigger: 'intro-3',
            },
            {
              id: 'intro-3',
              message: 'Faisons connaissance !',
              trigger: 'investment',
            },
            {
              id: 'investment',
              message: 'Combien voulez-vous investir ?',
              trigger: 'investment-choice',
            },
            {
              id: 'investment-choice',
              user: true,
              trigger: 'risk',
            },
            {
              id: 'risk',
              message:
                "Quel risque êtes-vous prêt à prendre ? Plus le risque est élevé plus le gain potentiel l'est aussi.",
              trigger: 'risk-choice',
            },
            {
              id: 'risk-choice',
              options: [
                {
                  value: 0.0025,
                  label: 'Risque élevé',
                  trigger: 'choice',
                },
                {
                  value: 0.0001,
                  label: 'Risque modéré',
                  trigger: 'choice',
                },
                {
                  value: 0.000025,
                  label: 'Risque faible',
                  trigger: 'choice',
                },
              ],
            },
            {
              id: 'choice',
              message: 'Regardons les thématiques qui vous intéressent.',
              trigger: 'animals',
            },
            {
              id: 'animals',
              message: 'Souhaitez-vous défendre les droits des animaux ?',
              trigger: 'animals-choice',
            },
            {
              id: 'animals-choice',
              options: [
                {
                  value: 0,
                  label: 'Non, pas vraiment',
                  trigger: 'forest',
                },
                {
                  value: 0.5,
                  label: 'Oui',
                  trigger: 'forest',
                },
                {
                  value: 1,
                  label: "Oui, c'est ma priorité",
                  trigger: 'forest',
                },
              ],
            },
            {
              id: 'forest',
              message: 'Souhaitez-vous protéger les forêts, les poumons de notre planète ?',
              trigger: 'forest-choice',
            },
            {
              id: 'forest-choice',
              options: [
                {
                  value: 0,
                  label: 'Pas vraiment',
                  trigger: 'climate',
                },
                {
                  value: 0.5,
                  label: "Si cela n'affecte pas trop le rendement",
                  trigger: 'climate',
                },
                {
                  value: 1,
                  label: '🌲🌳 Oui, plantons des arbres 🌴🎄',
                  trigger: 'climate',
                },
              ],
            },
            {
              id: 'climate',
              message: 'Souhaitez-vous agir pour protéger le climat ?',
              trigger: 'climate-choice',
            },
            {
              id: 'climate-choice',
              options: [
                {
                  value: 0,
                  label: 'Non, pas vraiment',
                  trigger: 'development',
                },
                {
                  value: 0.5,
                  label: 'Oui, je veux en tenir compte dans mes investissements',
                  trigger: 'development',
                },
                {
                  value: 1,
                  label: '🚵‍♀🥦 Absolument, je veux faire des investissements responsables ⛵🌎️️',
                  trigger: 'development',
                },
              ],
            },
            {
              id: 'development',
              message: 'Souhaitez-vous investir dans des projets aidant les pays en voie de développement?',
              trigger: 'development-choice',
            },
            {
              id: 'development-choice',
              options: [
                {
                  value: 0,
                  label: 'Non, pas vraiment',
                  trigger: 'energy',
                },
                {
                  value: 0.5,
                  label: "Oui, j'aimerais bien",
                  trigger: 'energy',
                },
                {
                  value: 1,
                  label: "C'est ma première priorité️",
                  trigger: 'energy',
                },
              ],
            },
            {
              id: 'energy',
              message: 'Souhaitez-vous développer les énergies renouvelables?',
              trigger: 'energy-choice',
            },
            {
              id: 'energy-choice',
              options: [
                {
                  value: -1,
                  label: '🛢🛢🛢 Non, ca marche bien le pétrole 🛢🛢🛢',
                  trigger: 'education',
                },
                {
                  value: 0,
                  label: 'Tant que ca ne baisse pas le rendement',
                  trigger: 'education',
                },
                {
                  value: 1,
                  label: "⚡️⚡️⚡️ Bien sur, Let's make America Greta again ️☀️☀️☀️",
                  trigger: 'education',
                },
              ],
            },
            {
              id: 'education',
              message: "Souhaitez-vous favoriser l'éducation et rendre les études accessibles à tous ?",
              trigger: 'education-choice',
            },
            {
              id: 'education-choice',
              options: [
                {
                  value: -1,
                  label: "Non, encore aujourd'hui je n'ai pas utilisé le théorème de Pythagore 🤦‍♂️",
                  trigger: this.getFunds,
                },
                {
                  value: 0,
                  label: 'On verra demain',
                  trigger: this.getFunds,
                },
                {
                  value: 1,
                  label: 'Yes, Knowledge is power 👩‍🎓👨‍🎓️',
                  trigger: this.getFunds,
                },
              ],
            },
            {
              id: 'loading',
              message: `Laissez-moi cogiter...`,
              delay: 10,
              trigger: 'result-1',
            },
            {
              id: 'result-1',
              message: 'Voici le portefeuille que nous vous avons concocté ! 😀',
              trigger: 'efficiency',
            },
            {
              id: 'efficiency',
              component: <div className="chart-wrapper">this is a test</div>,
              asMessage: true,
              trigger: 'doughnut-1',
            },
            {
              id: 'doughnut-1',
              message: 'Le portefeuille qui regroupe les fonds dans les thématiques qui vous intéressent :',
              trigger: 'doughnut-2',
            },
            {
              id: 'doughnut-2',
              component: (
                <div className="chart-wrapper">
                  <DoughnutChart portfolio={this.state.resultData.portfolioContent} />
                </div>
              ),
              asMessage: true,
              trigger: 'line-1',
            },
            {
              id: 'line-1',
              message: "Et voici l'évolution de votre investissement que vous pouvez espérer",
              trigger: 'line-2',
            },
            {
              id: 'line-2',
              component: (
                <div className="chart-wrapper">
                  <LineChart graph={this.state.resultData.graph} />
                </div>
              ),
              asMessage: true,
              trigger: 'order-1',
            },
            {
              id: 'order-1',
              message: "... et votre carnet d'ordres !",
              trigger: 'order-2',
            },
            {
              id: 'order-2',
              component: (
                <table className="order-book">
                  <tbody>
                    <tr>
                      <th>Isin</th>
                      <th>Fond</th>
                      <th>Prix</th>
                    </tr>
                    {this.state.resultData.portfolioContent.map(({ fund, weight }, index: number) => (
                      <tr key={index}>
                        <td>{fund.isin}</td>
                        <td>{fund.name}</td>
                        <td>{weight * this.state.initialInvestment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ),
              asMessage: true,
              end: true,
            },
          ]}
        />
      </div>
    );
  }
}
