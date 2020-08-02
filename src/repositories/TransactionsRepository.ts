import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateRepositoryDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((total, transaction) => total + transaction.value, 0);
    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.value, 0);
    const total = income - outcome;
    return {
      outcome,
      income,
      total,
    };
  }

  public create({ title, value, type }: CreateRepositoryDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome' && value > this.getBalance().total) {
      throw Error('This outcome went beyond the limit');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
