export type Attribute = "string" | "number" | "boolean" | "Date" | 'string[]' | 'number[]' | 'boolean[]' | 'Date[]';
export type ConstraintType = "required" | "unique" | "optional" | "default";
export interface Entity {
  name: string;
  attributes: Array<{ name: string; type: Attribute, constraint?: {value?:string, type:ConstraintType }}>;
  advancedOptions?: {
    methods: Array<{
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      name?: string;
      returns?: Array<"string">;
      isPaginated?: boolean;
      requiresAuth?: boolean;
    }>
  }
}

export interface Relation {
  from: string;
  to: string;
  type: "1-?1" | "1-m" | "m-1" | "1?-1";
  name: string;
  attributes?: Array<{ name: string; type: Attribute, constraint?: {value?:string, type:ConstraintType }}>;
}