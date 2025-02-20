/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import type { ChartsPluginSetup, PaletteRegistry } from '../../../../charts/public';
import type { IFieldFormat, SerializedFieldFormat } from '../../../../field_formats/common';
import type { RangeSelectContext, ValueClickContext } from '../../../../embeddable/public';
import type { PersistedState } from '../../../../visualizations/public';
import type { HeatmapExpressionProps } from './expression_functions';

export interface FilterEvent {
  name: 'filter';
  data: ValueClickContext['data'];
}

export interface BrushEvent {
  name: 'brush';
  data: RangeSelectContext['data'];
}

export type FormatFactory = (mapping?: SerializedFieldFormat) => IFieldFormat;

export type HeatmapRenderProps = HeatmapExpressionProps & {
  timeZone?: string;
  formatFactory: FormatFactory;
  chartsThemeService: ChartsPluginSetup['theme'];
  onClickValue: (data: FilterEvent['data']) => void;
  onSelectRange: (data: BrushEvent['data']) => void;
  paletteService: PaletteRegistry;
  uiState: PersistedState;
};

export interface ColorStop {
  color: string;
  stop: number;
}

export interface CustomPaletteParams {
  name?: string;
  reverse?: boolean;
  rangeType?: 'number' | 'percent';
  continuity?: 'above' | 'below' | 'all' | 'none';
  progression?: 'fixed';
  rangeMin?: number;
  rangeMax?: number;
  stops?: ColorStop[];
  colorStops?: ColorStop[];
  steps?: number;
}

export type RequiredPaletteParamTypes = Required<CustomPaletteParams>;
