// Authentication action types
export const AUTHENTICATE = 'AUTHENTICATE';
export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const USER_LOADING = 'USER_LOADING';

// profile action types
export const GET_PROFILE = 'GET_PROFILE';
export const DELETE_PROFILE = 'DELETE_PROFILE';

// Favorite recipes action types - TODO move to entity and keep state under user
export const SET_FAVORITE_RECIPES_LIST_LOADING = 'SET_FAVORITE_RECIPES_LIST_LOADING';
export const GET_FAVORITE_RECIPES = 'GET_FAVORITE_RECIPES';

// Favorite plant action types- TODO move to entity and keep state under user
export const SET_FAVORITE_PLANTS_LIST_LOADING = 'SET_FAVORITE_PLANTS_LIST_LOADING';
export const GET_FAVORITE_PLANTS = 'GET_FAVORITE_PLANTS';

// Credit card action types
export const SET_CREDIT_CARD_LIST_LOADING = 'SET_CREDIT_CARD_LIST_LOADING';
export const GET_CREDIT_CARD_LIST = 'GET_CREDIT_CARD_LIST';
export const SAVE_CREDIT_CARD = 'SAVE_CREDIT_CARD';
export const DELETE_CREDIT_CARD = 'DELETE_CREDIT_CARD';

// Subscription
export const TRIAL_SUBSCRIPTION_STARTED = 'TRIAL_SUBSCRIPTION_STARTED';
export const SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED';
export const SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED';