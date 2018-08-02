import { FragmentType } from './enums';

export class QueryFragment {
  constructor(public type: FragmentType, public value: string) {}
}
