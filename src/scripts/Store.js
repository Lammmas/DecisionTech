import Observable from "./Observable";

class Store extends Observable {
  constructor() {
    super();
    this.state = {
      deals: [],
      filteredDeals: [],
      productFilters: [],
      providerFilter: null
    };
  }

  get deals() {
    return this.filter();
  }

  get filters() {
    return { product: this.state.productFilters, provider: this.state.providerFilter };
  }

  setFilteredDeals() {
    const { productFilters, providerFilter, deals } = this.state;
    // TODO: apply filters to data
    this.state.filteredDeals = deals;
  }

  filter() {
    return this.state.filteredDeals;
  }

  setDeals(data) {
    this.state.deals = data;
    this.state.filteredDeals = data;
    this.notify(this.state);
  }

  setProductFilter(value) {
    const filter = value.trim().toLowerCase();
    const index = this.state.productFilters.indexOf(filter);
    if (index === -1) {
      this.state.productFilters.push(filter);
    } else {
      this.state.productFilters.splice(index, 1);
    }

    this.setFilteredDeals();
    this.notify(this.state);
  }

  setProviderFilter(value = null) {
    this.state.providerFilter = value;

    this.setFilteredDeals();
    this.notify(this.state);
  }
}

export default Store;
