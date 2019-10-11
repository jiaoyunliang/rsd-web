export let loadView = file => {
  return () => import(`@/components/${file}.vue`);
};
