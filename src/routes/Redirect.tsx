import React from 'react';
import { Redirect as RedirectBase } from 'react-router-dom';
import { navigationState } from '../state/NavigationState';

interface IRedirect {
  to: string;
}

const Redirect = ({ to }: IRedirect) => {
  navigationState.updateActiveUrl(to);

  return <RedirectBase to={to} />;
};

export default Redirect;
