import {
  ADD_ARTICLE
} 
from '../constants/actionTypes';

export function addArticle (payload) {
  return {
    type: ADD_ARTICLE, 
    payload
  }
}