interface HomeVisitApp {
  vault: {
    getName: () => string;
  };
  loadLocalStorage: (key: string) => unknown;
  saveLocalStorage: (key: string, value: unknown) => void;
}

const getVaultKey = (app: HomeVisitApp, key: string): string =>
  `${key}-${app.vault.getName()}`;

const getOnboardingShownKey = (app: HomeVisitApp): string =>
  getVaultKey(app, 'journalit-onboarding-ever-shown');

const getHomeVisitedKey = (app: HomeVisitApp): string =>
  getVaultKey(app, 'journalit-home-ever-visited');

const getFirstHomePendingKey = (app: HomeVisitApp): string =>
  getVaultKey(app, 'journalit-first-home-visit-pending');

export const hasOnboardingBeenShown = (app: HomeVisitApp): boolean =>
  Boolean(app.loadLocalStorage(getOnboardingShownKey(app)));

export const hasFirstHomeVisitPending = (app: HomeVisitApp): boolean =>
  Boolean(app.loadLocalStorage(getFirstHomePendingKey(app)));

export const markOnboardingShown = (app: HomeVisitApp): void => {
  app.saveLocalStorage(getOnboardingShownKey(app), true);
};

export const markFirstHomeVisitPending = (app: HomeVisitApp): void => {
  if (!app.loadLocalStorage(getHomeVisitedKey(app))) {
    app.saveLocalStorage(getFirstHomePendingKey(app), true);
  }
};

export const markHomeVisited = (app: HomeVisitApp): void => {
  app.saveLocalStorage(getHomeVisitedKey(app), true);
  app.saveLocalStorage(getFirstHomePendingKey(app), null);
};

export const resolveIsFirstHomeVisit = (app: HomeVisitApp): boolean => {
  if (app.loadLocalStorage(getHomeVisitedKey(app))) {
    return false;
  }

  if (hasFirstHomeVisitPending(app)) {
    return true;
  }

  if (hasOnboardingBeenShown(app)) {
    return false;
  }

  return true;
};
