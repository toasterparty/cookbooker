<style>
.hr-wrapper {
  padding: 10px 0;
}

.custom-hr {
  margin: 0;
}
</style>

<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/recipes">Recipes</router-link>
    </div>
    <div class="hr-wrapper">
      <hr class="custom-hr">
    </div>
    <router-view />
  </div>
</template>
