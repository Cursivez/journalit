

import React from 'react';
import { t } from '../../lang/helpers';


export const EconomicCalendarColumnHeader: React.FC = () => (
  <div className="journalit-econ-columns" aria-hidden="true">
    <span className="journalit-econ-columns__label journalit-econ-columns__label--actual">
      {t('view.economic-calendar.actual')}
    </span>
    <span className="journalit-econ-columns__label journalit-econ-columns__label--forecast">
      {t('view.economic-calendar.forecast')}
    </span>
    <span className="journalit-econ-columns__label journalit-econ-columns__label--previous">
      {t('view.economic-calendar.previous')}
    </span>
  </div>
);

EconomicCalendarColumnHeader.displayName = 'EconomicCalendarColumnHeader';
