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

    if (!productFilters.length && providerFilter === null) this.state.filteredDeals = deals;
    else {
      const capsProductfilters = productFilters.map(filter => {
        if (filter === 'tv') return 'TV';
        if (filter === 'fibre broadband') return 'Fibre Broadband';
        return filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase();
      });

      this.state.filteredDeals = deals.filter(deal => {
        if (deal.provider.id === providerFilter && !productFilters.length) return true;
        if (providerFilter && deal.provider.id !== providerFilter) return false;
        
        return capsProductfilters.every(filter => deal.productTypes.includes(filter));
      });
    }
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

  // I would use Flow and Enum/number type in order to make sure nobody passes a string here
  setProviderFilter(value = null) {
    this.state.providerFilter = value;

    this.setFilteredDeals();
    this.notify(this.state);
  }
}

export default Store;
