import DefaultPreference from 'react-native-default-preference';

export const getCurrentPage = () => {
  return DefaultPreference.get('currentPage');
};

export const setCurrentPage = currentPage => {
  return DefaultPreference.set('currentPage', currentPage);
};
