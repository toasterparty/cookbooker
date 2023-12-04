<style>

.recipe-listing {
  font-size: 20px;
  padding: 3px 8px;
}

</style>

<template>
  <div class="recipes">
    <h1>Recipes</h1>
    <div v-if="!recipes">
      <ul>
        <li>⌛</li>
      </ul>
    </div>
    <div v-else>
      <button class="add-button" @click="new_recipe">
        Create New
      </button>
      <div v-for="recipe in recipes" :key="recipe.name">
        <a v-if="recipe.name" class="recipe-listing" :href="'/recipes/' + recipe.recipe_id" target="_blank">{{ recipe.name }}</a>
        <a v-else class="recipe-listing" :href="'/recipes/' + recipe.recipe_id" target="_blank">[NEW RECIPE]</a>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../lib/supabase_api'

export default {
  name: 'recipes',
  data() {
    return {
      recipes: null
    }
  },
  async mounted() {
    this.recipes = await api.get_all_recipes()
  },
  methods: {
    async new_recipe() {
      var recipe_id = await api.new_recipe()
      window.location.href = '/edit/' + recipe_id
    }
  }
}
</script>
