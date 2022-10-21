import { useActivator } from './useActivator';

const {
  isActive: isOverlayVisible,
  activate: showOverlay,
  deactivate: hideOverlay,
} = useActivator({ debounce: 10 });

export { isOverlayVisible, showOverlay, hideOverlay };
