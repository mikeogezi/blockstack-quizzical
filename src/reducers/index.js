const initialState = {
  articles: []
};

export default function rootReducer (state = initialState, action) {
  switch (action.type) {
    case 'ADD_ARTICLE':
      return {
        ...state,
        articles: state.articles.concat(action.payload)
      }
    default:
      return state;
  }
}