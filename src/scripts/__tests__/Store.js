import Store from '../Store';
import mockData from '../../../public/db.json';

describe('filter', () => {
  const dealCounts = {
    all: 11,
    broadband: 4,
    broadband_tv: 4,
    broadband_mobile: 1,
    Sky: 1,
    BT: 5,
    Plusnet: 3,
    Plusnet_broadband: 3,
    BT_broadband_tv: 2
  };
  const providers = {
    BT: 3,
    Plusnet: 42,
    Origin: 116,
    EE: 48,
    Sky: 1
  };
  let store;

  beforeEach(() => {
    store = new Store;
    store.setDeals(mockData.deals);
  });

  it('should return all deals with no filters applied', () => {
    const result = store.deals;
    
    expect(result).toEqual(mockData.deals);
    expect(result).toHaveLength(dealCounts.all);
  });

  it('should remove the product filter on recalling the set function', () => {
    expect(store.filters.product).toHaveLength(0);

    store.setProductFilter('broadband');
    expect(store.filters.product).toHaveLength(1);

    store.setProductFilter('broadband');
    expect(store.filters.product).toHaveLength(0);
  });

  it('should remove the provider filter on recalling the set function', () => {
    const providerName = 'My provider';

    expect(store.filters.provider).toEqual(null);

    store.setProviderFilter(providerName);
    expect(store.filters.provider).toEqual(providerName);

    store.setProviderFilter(null);
    expect(store.filters.provider).toEqual(null);
  });

  // For the purposes of the test task, these individual filter tests are all in one test
  // In a real project, would probably have an array of tests, one for each filter
  // Would look cleaner also
  it('should return only matching deals with 1 product filter active', () => {
    let result;

    // Broadband
    store.setProductFilter('broadband');
    result = store.deals;
    expect(result).toHaveLength(dealCounts.broadband);
    // Re-calling the set filter fn removes the filter
    store.setProductFilter('broadband');
  });

  it('should return only matching deals with 2 product filters active', () => {
    let result;

    // Broadband + TV
    store.setProductFilter('broadband');
    store.setProductFilter('tv');
    result = store.deals;
    expect(result).toHaveLength(dealCounts.broadband_tv);
    store.setProductFilter('broadband');
    store.setProductFilter('tv');

    // Broadband + Mobile
    store.setProductFilter('broadband');
    store.setProductFilter('mobile');
    result = store.deals;
    expect(result).toHaveLength(dealCounts.broadband_mobile);
  });

  it('should return only matching deals with 1 provider filter active', () => {
    let result;

    store.setProviderFilter(providers.BT);
    result = store.deals;
    expect(result).toHaveLength(dealCounts.BT);
    store.setProviderFilter(providers.BT);

    store.setProviderFilter(providers.Plusnet);
    result = store.deals;
    expect(result).toHaveLength(dealCounts.Plusnet);
    store.setProviderFilter(providers.Plusnet);

    store.setProviderFilter(providers.Sky);
    result = store.deals;
    expect(result).toHaveLength(dealCounts.Sky);
  });

  it('should return only matching deals with 1 provider and 1 product filters active', () => {
    store.setProviderFilter(providers.Plusnet);
    store.setProductFilter('broadband');

    const result = store.deals;
    expect(result).toHaveLength(dealCounts.Plusnet_broadband);
  });

  it('should return only matching deals with 1 provider and 2 product filters active', () => {
    store.setProviderFilter(providers.BT);
    store.setProductFilter('broadband');
    store.setProductFilter('tv');

    const result = store.deals;
    expect(result).toHaveLength(dealCounts.BT_broadband_tv);
  });
});
