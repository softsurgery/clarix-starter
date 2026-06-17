export const applyOverlayStyles = () => {
  const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
  if (overlayContainer) {
    overlayContainer.style.opacity = '0.5';
  } else {
    console.warn('CDK overlay container not found');
  }
};

export const removeOverlayStyles = () => {
  const overlayContainer = document.querySelector('.cdk-overlay-container') as HTMLElement;
  if (overlayContainer) {
    overlayContainer.style.opacity = '0';
  }
};
