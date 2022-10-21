import { useNProgress } from '@vueuse/integrations/useNProgress';

import { useActivator } from './useActivator';

const { start, done, isLoading } = $(
  useNProgress(null, { showSpinner: false })
);

const { activate: startNProgress, deactivate: stopNProgress } = useActivator({
  onActivation: () => {
    if (!isLoading) {
      start();
    }
  },
  onDeactivation: () => {
    if (isLoading) {
      done();
    }
  },
  debounce: 1,
});

export { startNProgress, stopNProgress };
