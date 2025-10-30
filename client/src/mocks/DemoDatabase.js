// mocks/database.js
class DemoDatabase {
  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.groups = new Map();
    this.currentUser = null;
  }

  // User methods
  createUser(userData) {
    const userId = Math.random().toString(36).substr(2, 9);
    const newUser = {
      ...userData,
      _id: userId,
      totalBalance: 0,
      level: 1,
      hasProvidedStartingBalance: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      appearanceSettings: {
        theme: "dark",
        accentColor: "blue",
        fontFamily: "inter",
        animationsEnabled: true,
        iconPack: "default",
      }
    };
    this.users.set(userData.email, newUser);
    this.transactions.set(userId, []);
    this.currentUser = newUser;
    return newUser;
  }

  // Transaction methods
  addTransaction(transactionData) {
    const userId = this.currentUser?._id;
    if (!userId) return null;

    const transaction = {
      _id: Math.random().toString(36).substr(2, 9),
      ...transactionData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!this.transactions.has(userId)) {
      this.transactions.set(userId, []);
    }

    this.transactions.get(userId).push(transaction);

    // Update user balance
    if (this.currentUser) {
      const amount = transactionData.transactionType === 'inflow' ? transactionData.amount : -transactionData.amount;
      this.currentUser.totalBalance += amount;
      this.users.set(this.currentUser.email, this.currentUser);
    }

    return transaction;
  }

  getTransactions(userId) {
    return this.transactions.get(userId) || [];
  }

  updateTransaction(transactionId, updates) {
    const userId = this.currentUser?._id;
    if (!userId) return null;

    const userTransactions = this.transactions.get(userId) || [];
    const transactionIndex = userTransactions.findIndex(t => t._id === transactionId);

    if (transactionIndex !== -1) {
      // Adjust balance if amount changed
      const oldTransaction = userTransactions[transactionIndex];
      if (updates.amount !== undefined && oldTransaction.amount !== updates.amount) {
        const oldAmount = oldTransaction.transactionType === 'inflow' ? oldTransaction.amount : -oldTransaction.amount;
        const newAmount = (updates.transactionType || oldTransaction.transactionType) === 'inflow' ? updates.amount : -updates.amount;

        if (this.currentUser) {
          this.currentUser.totalBalance = this.currentUser.totalBalance - oldAmount + newAmount;
          this.users.set(this.currentUser.email, this.currentUser);
        }
      }

      userTransactions[transactionIndex] = {
        ...oldTransaction,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return userTransactions[transactionIndex];
    }
    return null;
  }

  deleteTransaction(transactionId) {
    const userId = this.currentUser?._id;
    if (!userId) return false;

    const userTransactions = this.transactions.get(userId) || [];
    const transactionIndex = userTransactions.findIndex(t => t._id === transactionId);

    if (transactionIndex !== -1) {
      const transaction = userTransactions[transactionIndex];

      // Adjust balance
      if (this.currentUser) {
        const amount = transaction.transactionType === 'inflow' ? transaction.amount : -transaction.amount;
        this.currentUser.totalBalance -= amount;
        this.users.set(this.currentUser.email, this.currentUser);
      }

      userTransactions.splice(transactionIndex, 1);
      return true;
    }
    return false;
  }
}

// Create a singleton instance
export const demoDB = new DemoDatabase();
