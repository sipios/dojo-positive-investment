import { ExternalityName } from '../types/types';

export const fundsArray = [
  {
    isin: 12,
    name: 'Ocean',
    history: [50, 30, 35, 40],
    externalities: [{ name: ExternalityName.FOREST, score: 10 }],
    description: '',
  },
];

export const EXPECTATION_MULTIPLIER_BASE_IN_PERCENT = 0.1 / 100;

export const NUMBER_OF_MONTHS = 120;
