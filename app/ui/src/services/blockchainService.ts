import axios from 'axios';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  gasPrice: string;
  gasUsed: string;
}

interface AddressAnalysis {
  address: string;
  totalTransactions: number;
  totalVolume: number;
  averageTransactionValue: number;
  anomalies: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export class BlockchainService {
  private readonly ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
  private readonly ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

  async getAddressTransactions(address: string): Promise<Transaction[]> {
    try {
      const response = await axios.get(this.ETHERSCAN_API_URL, {
        params: {
          module: 'account',
          action: 'txlist',
          address,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: this.ETHERSCAN_API_KEY,
        },
      });

      if (response.data.status === '1') {
        return response.data.result;
      }
      throw new Error('Failed to fetch transactions');
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async analyzeAddress(address: string): Promise<AddressAnalysis> {
    const transactions = await this.getAddressTransactions(address);

    // Calculate basic metrics
    const totalTransactions = transactions.length;
    const totalVolume = transactions.reduce((sum, tx) => sum + Number(tx.value), 0);
    const averageTransactionValue = totalVolume / totalTransactions;

    // Detect anomalies
    const anomalies = this.detectAnomalies(transactions);

    return {
      address,
      totalTransactions,
      totalVolume,
      averageTransactionValue,
      anomalies,
    };
  }

  private detectAnomalies(transactions: Transaction[]): AddressAnalysis['anomalies'] {
    const anomalies: AddressAnalysis['anomalies'] = [];

    // 1. Check for unusual transaction frequency
    const timeWindow = 24 * 60 * 60; // 24 hours in seconds
    const recentTransactions = transactions.filter(
      tx => Date.now() / 1000 - tx.timestamp < timeWindow
    );

    if (recentTransactions.length > 100) {
      anomalies.push({
        type: 'high_frequency',
        description: 'Unusually high number of transactions in the last 24 hours',
        severity: 'high',
      });
    }

    // 2. Check for unusual transaction values
    const values = transactions.map(tx => Number(tx.value));
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sq, n) => sq + Math.pow(n - avgValue, 2), 0) / values.length
    );

    const unusualTransactions = transactions.filter(
      tx => Math.abs(Number(tx.value) - avgValue) > 3 * stdDev
    );

    if (unusualTransactions.length > 0) {
      anomalies.push({
        type: 'unusual_values',
        description: 'Detected transactions with unusually high or low values',
        severity: 'medium',
      });
    }

    // 3. Check for gas price anomalies
    const avgGasPrice =
      transactions.reduce((sum, tx) => sum + Number(tx.gasPrice), 0) / transactions.length;
    const highGasTransactions = transactions.filter(tx => Number(tx.gasPrice) > avgGasPrice * 2);

    if (highGasTransactions.length > 5) {
      anomalies.push({
        type: 'gas_anomaly',
        description: 'Multiple transactions with unusually high gas prices',
        severity: 'medium',
      });
    }

    return anomalies;
  }
}
