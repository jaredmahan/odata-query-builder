import { FragmentType } from './enums';
import { QueryFragment } from './queryFragment';

const orderBy = require('lodash.orderby');

type filterExpressionType = string | number | boolean | Date;

export default class FilterBuilder {
  private fragments: QueryFragment[] = [];
  filterExpression = (field: string, operator: string, value: filterExpressionType) => {
    this.fragments.push(
      new QueryFragment(FragmentType.Filter, `${field} ${operator} ${this.getValue(value)}`)
    );
    return this;
  };
  filterPhrase = (phrase: string) => {
    this.fragments.push(new QueryFragment(FragmentType.Filter, phrase));
    return this;
  };
  and = (predicate: (filter: FilterBuilder) => FilterBuilder) => {
    this.fragments.push(
      new QueryFragment(FragmentType.Filter, `(${predicate(new FilterBuilder()).toQuery('and')})`)
    );
    return this;
  };
  or = (predicate: (filter: FilterBuilder) => FilterBuilder) => {
    this.fragments.push(
      new QueryFragment(FragmentType.Filter, `(${predicate(new FilterBuilder()).toQuery('or')})`)
    );
    return this;
  };
  toQuery = (operator: string): string => {
    if (!this.fragments || this.fragments.length < 1) return '';
    return this.fragments.map(f => f.value).join(` ${operator} `);
  };

  private getValue(value: filterExpressionType): string {
    let type: string = typeof value;
    if (value instanceof Date) type = 'date';

    switch (type) {
      case 'string':
        return `'${value}'`;
      case 'date':
        return `${(value as Date).toISOString()}`;
      default:
        return `${value}`;
    }
  }
}

export class QueryBuilder {
  private fragments: QueryFragment[] = [];
  orderBy = (fields: string) => {
    this.clear(FragmentType.OrderBy);
    this.fragments.push(new QueryFragment(FragmentType.OrderBy, `$orderby=${fields}`));
    return this;
  };
  top = (top: number) => {
    this.clear(FragmentType.Top);
    this.fragments.push(new QueryFragment(FragmentType.Top, `$top=${top}`));
    return this;
  };
  skip = (skip: number) => {
    this.clear(FragmentType.Skip);
    this.fragments.push(new QueryFragment(FragmentType.Skip, `$skip=${skip}`));
    return this;
  };
  count = () => {
    this.clear(FragmentType.Count);
    this.fragments.push(new QueryFragment(FragmentType.Count, `$count=true`));
    return this;
  };
  expand = (fields: string) => {
    this.clear(FragmentType.Expand);
    this.fragments.push(new QueryFragment(FragmentType.Expand, `$expand=${fields}`));
    return this;
  };
  select = (fields: string) => {
    this.clear(FragmentType.Select);
    this.fragments.push(new QueryFragment(FragmentType.Select, `$select=${fields}`));
    return this;
  };
  filter = (predicate: (filter: FilterBuilder) => FilterBuilder, operator: string = 'and') => {
    this.clear(FragmentType.Filter);
    this.fragments.push(
      new QueryFragment(FragmentType.Filter, predicate(new FilterBuilder()).toQuery(operator))
    );
    return this;
  };
  clear = (fragmentType: FragmentType) => {
    this.fragments = this.fragments.filter(f => f.type !== fragmentType);
    return this;
  }
  toQuery = () => {
    if (this.fragments.length < 1) return '';

    const sortedFragments = orderBy(this.fragments, (sf: QueryFragment) => sf.type);
    const nonFilterFragments = sortedFragments.filter((sf: QueryFragment) => sf.type !== FragmentType.Filter);
    const filterFragments = sortedFragments.filter((sf: QueryFragment) => sf.type === FragmentType.Filter);

    let query =
      '?' +
      sortedFragments
        .filter((sf: QueryFragment) => sf.type !== FragmentType.Filter)
        .map((sf: QueryFragment) => sf.value)
        .join('&');

    if (filterFragments.length < 1) return query;
    else if (nonFilterFragments.length > 0) query += '&';

    query += this.parseFilters(filterFragments, 'and').trim();

    return query;
  };

  private parseFilters(fragments: QueryFragment[], operator: string): string {
    if (!fragments === null || fragments.length < 1) return '';
    return '$filter=' + fragments.map(f => f.value).join(` ${operator} `);
  }
}
