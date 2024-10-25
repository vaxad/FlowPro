import { Entity } from "./types";

export const userEntity: Entity = {
  name: 'user',
  attributes: [
  {
    "name": "name",
    "type": "string"
  },
  {
    "name": "insta",
    "type": "string"
  },
  {
    "name": "createdAt",
    "type": "string"
  },
  {
    "name": "email",
    "type": "string",
    "constraint": {
      "type": "unique"
    }
  },
  {
    "name": "password",
    "type": "string"
  }
]
};
    

export const postEntity: Entity  = {
  name: 'post',
  attributes: [
  {
    "name": "title",
    "type": "string"
  },
  {
    "name": "desc",
    "type": "string"
  },
  {
    "name": "seq",
    "type": "number"
  }
]
};
    

export const commentsEntity: Entity  = {
  name: 'comments',
  attributes: [
  {
    "name": "text",
    "type": "string"
  }
]
};
    
export default { userEntity, postEntity, commentsEntity };