/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButtonIcon, EuiToolTip } from '@elastic/eui';
import React, { useCallback, useMemo } from 'react';
import type { Filter } from '@kbn/es-query';
import { WithHoverActions } from '../with_hover_actions';
import { useKibana } from '../../lib/kibana';

import * as i18n from './translations';

export * from './helpers';

interface OwnProps {
  children: JSX.Element;
  filter: Filter;
  onFilterAdded?: () => void;
}

export const AddFilterToGlobalSearchBar = React.memo<OwnProps>(
  ({ children, filter, onFilterAdded }) => {
    const { filterManager } = useKibana().services.data.query;

    const filterForValue = useCallback(() => {
      filterManager.addFilters(filter);

      if (onFilterAdded != null) {
        onFilterAdded();
      }
    }, [filterManager, filter, onFilterAdded]);

    const filterOutValue = useCallback(() => {
      filterManager.addFilters({
        ...filter,
        meta: {
          ...filter.meta,
          negate: true,
        },
      });

      if (onFilterAdded != null) {
        onFilterAdded();
      }
    }, [filterManager, filter, onFilterAdded]);

    const HoverContent = useMemo(
      () => (
        <div data-test-subj="hover-actions-container">
          <EuiToolTip content={i18n.FILTER_FOR_VALUE}>
            <EuiButtonIcon
              aria-label={i18n.FILTER_FOR_VALUE}
              color="text"
              data-test-subj="add-to-filter"
              iconType="magnifyWithPlus"
              onClick={filterForValue}
            />
          </EuiToolTip>

          <EuiToolTip content={i18n.FILTER_OUT_VALUE}>
            <EuiButtonIcon
              aria-label={i18n.FILTER_OUT_VALUE}
              color="text"
              data-test-subj="filter-out-value"
              iconType="magnifyWithMinus"
              onClick={filterOutValue}
            />
          </EuiToolTip>
        </div>
      ),
      [filterForValue, filterOutValue]
    );

    const render = useCallback(() => children, [children]);

    return <WithHoverActions hoverContent={HoverContent} render={render} />;
  }
);

AddFilterToGlobalSearchBar.displayName = 'AddFilterToGlobalSearchBar';
