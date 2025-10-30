// mocks/enableMocking.js
async function enableMocking() {
  if (import.meta.env.VITE_IS_DEMO_ENABLED === 'true') {
    const { worker } = await import('./browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

export default enableMocking;
