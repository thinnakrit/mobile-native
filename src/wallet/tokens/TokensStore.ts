//@ts-nocheck
import { action } from 'mobx';

import walletService from '../WalletService';
import OffsetListStore from '../../common/stores/OffsetListStore';
import logService from '../../common/services/log.service';
import { ListFiltersType } from '../v2/TransactionList/types';

export default class TokensStore {
  list = new OffsetListStore('shallow');
  loading = false;
  mode = 'rewards';

  /**
   * Set mode
   * @param {string} rewards|contributions
   */
  setMode(mode) {
    this.mode = mode;
  }

  /**
   * Load list
   */
  loadList(from, to) {
    if (this.list.cantLoadMore() || this.loading) {
      return Promise.resolve();
    }
    this.loading = true;

    const fetchFn =
      this.mode === 'transactions'
        ? walletService.getTransactionsLedger
        : walletService.getContributions;

    return fetchFn(from, to, this.list.offset)
      .then((feed) => {
        this.list.setList(feed);
        this.loaded = true;
      })
      .finally(() => {
        this.loading = false;
      })
      .catch((err) => {
        logService.exception('[TokensStore]', err);
      });
  }

  async loadTransactionsListAsync(filters: ListFiltersType, callback) {
    console.log('loadTransactionsListAsync');
    if (this.list.cantLoadMore() || this.loading) {
      return false;
    }
    this.loading = true;
    console.log('loading', this.loading);

    try {
      const feed = await walletService.getFilteredTransactionsLedger(
        filters,
        this.list.offset,
      );

      console.log('feed', feed);

      this.list.setList(feed, false, callback);
      this.loaded = true;
      console.log('loaded', this.loaded);
    } catch (err) {
      logService.exception('[TokensStore]', err);
    } finally {
      this.loading = false;
    }
  }

  @action
  refreshTransactionsList(filters: ListFiltersType, callback) {
    console.log('refreshTransactionsList');
    this.list.refresh();
    console.log('refreshed');
    this.loadTransactionsListAsync(filters, callback).finally(() => {
      this.list.refreshDone();
    });
  }

  @action
  refresh(from, to) {
    this.list.refresh();
    this.loadList(from, to).finally(() => {
      this.list.refreshDone();
    });
  }
}
