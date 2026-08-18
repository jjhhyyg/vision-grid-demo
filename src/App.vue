<template>
  <PortfolioDemo />
</template>

<script setup>
import PortfolioDemo from './views/demo/PortfolioDemo.vue'
</script>

<style>
:root {
  color-scheme: dark;
  background: #0c0e0d;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  min-width: 320px;
  min-height: 100%;
  margin: 0;
}

body {
  min-height: 100vh;
  background: #0c0e0d;
}

button,
input,
select,
textarea {
  font: inherit;
}
</style>
