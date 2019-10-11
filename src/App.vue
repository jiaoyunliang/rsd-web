<template>
  <div id="app">
    <router-view />
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created: function() {
    this.$Progress.start();

    this.$router.beforeEach((to, from, next) => {
      //  does the page we want to go to have a meta.progress object
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress;
        // parse meta tags
        this.$Progress.parseMeta(meta);
      }
      //  start the progress bar
      this.$Progress.start();
      //  continue to next page
      next();
    });
    //  hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach((to, from) => {
      //  finish the progress bar
      this.$Progress.finish();
    });
  },
  mounted: function() {
    this.$Progress.finish();
  },
  computed: {},
  methods: {}
};
</script>

<style>
@import "../static/css/css.css";
</style>
