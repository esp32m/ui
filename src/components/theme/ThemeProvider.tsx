import React, { useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import {
  alpha,
  createTheme,
  ThemeOptions,
  ThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { usePlugins } from '../..';
import { IThemePlugin } from './types';
import { merge } from 'lodash';

interface CustomShadowOptions {
  z1: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  dropdown: string;
}

const createCustomShadows = (color: string) => {
  const transparent = alpha(color, 0.16);
  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    dropdown: `0 0 2px 0 ${alpha(color, 0.24)}, -20px 20px 40px -4px ${alpha(color, 0.24)}`,
  };
};

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadowOptions;
  }
  interface ThemeOptions {
    customShadows?: CustomShadowOptions;
  }
}

export default ({ children }: React.PropsWithChildren<unknown>) => {
  const plugins = usePlugins<IThemePlugin>();
  const themeOptions: ThemeOptions = useMemo(
    () =>
      plugins
        .filter((p) => !!p.theme)
        .reduce((p, c) => merge(p, c.theme), {
          customShadows: createCustomShadows('#919EAB'),
        }),
    [plugins]
  );

  const theme = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
