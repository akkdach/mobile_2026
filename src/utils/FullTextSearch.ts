export const FullTextSearch = (
  results: any[],
  primaryKey: string,
  textSearch: string,
) => {
  const searchTerm = textSearch;

  let result: any[] = [];

  const getEachItem = (object: any) => {
    object.forEach((item: any) => {
      searchItem(item);
    });
    let uniqueResults = [...new Set(results)];
    return uniqueResults.length;
  };

  const searchItem = (item: any) => {
    Object.keys(item).forEach(key => {
      if (item[key] && typeof item[key] === 'object') {
        searchItem(item[key]);
      }
      if (typeof item[key] === 'string') {
        let searchAsRegEx = new RegExp(searchTerm, 'gi');
        if (item[key].match(searchAsRegEx)) {
          result.push(item);
        }
      }
    });
  };

  getEachItem(results);

  const groupArray = result.reduce((r, a) => {
    r[a[primaryKey]] = r[a[primaryKey]] || [];
    r[a[primaryKey]].push(a);
    return r;
  }, Object.create(null));

  const newGroup = [];
  for (const [key, value] of Object.entries(groupArray)) {
    newGroup.push({
      day: key,
      orders: [...(value as any[])],
    });
  }

  return newGroup;
};

export const FullArrayTextSearch = (results: any[], textSearch: string) => {
  const searchTerm = textSearch;

  let result: any[] = [];

  const getEachItem = (object: any) => {
    object.forEach((item: any) => {
      searchItem(item);
    });
    let uniqueResults = [...new Set(results)];
    return uniqueResults.length;
  };

  const searchItem = (item: any) => {
    Object.keys(item).forEach(key => {
      if (item[key] && typeof item[key] === 'object') {
        searchItem(item[key]);
      }
      if (typeof item[key] === 'string') {
        let searchAsRegEx = new RegExp(searchTerm, 'gi');
        if (item[key].match(searchAsRegEx)) {
          result.push(item);
        }
      }
    });
  };

  getEachItem(results);

  return result;
};

export const FilterArrStrGroup = (
  results: any[],
  keyFilter: string,
  primaryKeyGroup: string,
  compareFilter: string[],
) => {
  const filterArr = results.filter(
    result => !!compareFilter.find(val => result[keyFilter] === val),
  );

  const groupArray = filterArr.reduce((r, a) => {
    r[a[primaryKeyGroup]] = r[a[primaryKeyGroup]] || [];
    r[a[primaryKeyGroup]].push(a);
    return r;
  }, Object.create(null));

  const newGroup = [];
  for (const [key, value] of Object.entries(groupArray)) {
    newGroup.push({
      day: key,
      orders: [...(value as any[])],
    });
  }

  return newGroup;
};
