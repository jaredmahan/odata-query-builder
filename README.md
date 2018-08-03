# odata-query-builder
An eloquently fluent OData query builder.

[![Build Status](https://travis-ci.org/jaredmahan/angular-searchFilter.svg?branch=master)](https://travis-ci.org/jaredmahan/odata-query-builder)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Install
```
yarn add odata-query-builder
```
or
```
npm install --save odata-query-builder
```

Then in your code...
```
const query = new QueryBuilder()
  .count()
  .top(5)
  .skip(5)
  .expand('NavigationProp')
  .orderBy('MyPriorityProp')
  .filter(f => f.filterExpression('Property', 'eq', 'MyValue'))
  .toQuery()
```
Outputs: 
```
_?$orderby=MyPriorityProp&$top=5&$skip=5&$count=true&$expand=NavigationProp&$filter=Property eq 'MyValue'_
```

Also Has Support for the following (More Documentation Comming Soon!):
- Nested and/or queries
- root level and/or queries
- various filter expression primitive types

