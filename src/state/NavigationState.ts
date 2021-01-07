import { observable, action } from 'mobx';

export interface IShrinkable {
  isSidebarOpen: boolean;
}

class NavigationState {
  @observable url: string = window.location.pathname;

  @observable isSidebarOpen: boolean = false;

  @action updateActiveUrl = (url: string) => {
    this.url = `/${url}`;
  };

  @action setIsSidebarOpen = (newIsSidebarOpen: boolean) => {
    this.isSidebarOpen = newIsSidebarOpen;
  };

  @action goTo = (url: string) => {
    this.updateActiveUrl(url);
    window.location.href = `/${url}`;
  };
}

export const navigationState = new NavigationState();
