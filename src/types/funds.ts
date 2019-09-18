export interface Fund {
  isin: string;
  name: string;
  history: number[];
  externalities: Externality[];
  description: string;
}

interface Externality {
  name: string;
  value: number;
}
