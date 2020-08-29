import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    title: 'Svelte & Typescript on ZeroNet',
  },
});
let loading = document.getElementById('loading');
if (loading) {
  if (loading.remove) {
    loading.remove();
  } else {
    loading.outerHTML = '';
  }
}

export default app;
