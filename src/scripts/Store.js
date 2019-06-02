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

  // Helper function for making testing easier
  get filters() {
    return { product: this.state.productFilters, provider: this.state.providerFilter };
  }

  setFilteredDeals() {
    const { productFilters, providerFilter, deals } = this.state;

    if (!productFilters.length && providerFilter === null) this.state.filteredDeals = deals;
    else {
      this.state.filteredDeals = deals.filter(deal => {
        if (deal.provider.id === providerFilter && !productFilters.length) return true;
        if (providerFilter && deal.provider.id !== providerFilter) return false;
        
        let { productTypes } = deal;
        // Because Fibre Broadband should be treated the same as Broadband
        productTypes = deal.productTypes
          .filter(type => type !== 'Phone')
          .map(type => type === 'Fibre Broadband' ? 'broadband' : type.toLowerCase());

        // If the filters are not the same length as types, they can never be equal
        if (productTypes.length !== productFilters.length) return false;

        // Check if filters and types match in both directions
        const hasAllFilters = productFilters.every(filter => productTypes.includes(filter));
        const hasAllTypes = productTypes.every(type => productFilters.includes(type));
        
        return hasAllFilters && hasAllTypes;
      });
    }
  }

  filter() {
    return this.state.filteredDeals;
  }

  // When updating the base data we want to make sure that the base filtered data get updated too
  setDeals(data) {
    this.state.deals = data;
    this.setFilteredDeals();
    this.notify(this.state);
  }

  // I would use Flow with Enum type here to make sure only valid filters are passed in
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
