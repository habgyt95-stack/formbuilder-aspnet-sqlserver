import './i18n/config';
import { FormBuilder } from './components/FormBuilder';
import type { FormBuilderOptions } from './types';

interface AppProps {
  options?: FormBuilderOptions;
}

function App({ options = {} }: AppProps) {
  return (
    <FormBuilder
      onInit={options.onInit}
      onSave={options.onSave}
    />
  );
}

export default App;
