/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { TLSFields, ConfigKey } from '../../fleet_package/types';
import { arrayFormatter, Formatter } from './common';

type TLSFormatMap = Record<keyof TLSFields, Formatter>;

export const tlsFormatters: TLSFormatMap = {
  [ConfigKey.TLS_CERTIFICATE_AUTHORITIES]: null,
  [ConfigKey.TLS_CERTIFICATE]: null,
  [ConfigKey.TLS_KEY]: null,
  [ConfigKey.TLS_KEY_PASSPHRASE]: null,
  [ConfigKey.TLS_VERIFICATION_MODE]: null,
  [ConfigKey.TLS_VERSION]: (fields) => arrayFormatter(fields[ConfigKey.TLS_VERSION]),
};
