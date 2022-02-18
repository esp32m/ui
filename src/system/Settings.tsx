import { Grid, MenuItem } from '@mui/material';

import { Name, ISystemConfig } from './types';
import {
  Expander,
  ConfigBox,
  useConfig,
  FieldSwitch,
  FieldSelect,
} from '..';


const FreqOptions = [
  [undefined, 'Default'],
  [240, '240 MHz'],
  [160, '160 MHz'],
  [80, '80 MHz'],
];

const FreqField = ({ i }: { i: number }) => (
  <FieldSelect
    fullWidth
    name={'pm.' + i}
    label={(i ? 'Min' : 'Max') + '. CPU frequency'}
  >
    {FreqOptions.map((o) => (
      <MenuItem key={o[0] || '_'} value={o[0]}>
        {o[1]}
      </MenuItem>
    ))}
  </FieldSelect>
);

export default () => {
  const [config] = useConfig<ISystemConfig>(Name);
  if (!config) return null;

  return (
    <ConfigBox name={'esp32'} initial={config} title="System settings">
      <Expander title="Power management" defaultExpanded>
        <Grid item xs>
          <FieldSwitch
            name="pm.2"
            label="Use Dynamic Frequency Scaling (light sleep)"
          />
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <FreqField i={0} />
          </Grid>
          <Grid item xs>
            <FreqField i={1} />
          </Grid>
        </Grid>
      </Expander>
    </ConfigBox>
  );
};
