import { Response } from '../types/types';

export class ChatService {
  private initialInvestment: number = 0;
  private resultData: Response = {
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
  };

  private static serviceInstance: ChatService | null = null;

  private constructor() {}

  public static getInstance = (): ChatService => {
    if (ChatService.serviceInstance) {
      return ChatService.serviceInstance;
    }
    const chatService = new ChatService();
    ChatService.serviceInstance = chatService;
    return ChatService.serviceInstance;
  };

  public getInitialInvestment = (): number => this.initialInvestment;

  public getTotal = (): Response['total'] => this.resultData.total;

  public getGraph = (): Response['graph'] => this.resultData.graph;

  public getPortfolioContent = (): Response['portfolioContent'] => this.resultData.portfolioContent;

  public setInitialInvestment = (newInitialInvestment: number): void => {
    this.initialInvestment = newInitialInvestment;
  };

  public setResultData = (newResultData: Response): void => {
    this.resultData = newResultData;
  };
}
