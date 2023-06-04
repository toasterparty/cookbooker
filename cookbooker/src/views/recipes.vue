<template>
  <div class="recipes">
    <h1>Recipes</h1>
    <div v-if="!recipes">
      <ul>
        <li>⌛</li>
      </ul>
    </div>
    <div v-else>
      <ul>
        <li v-for="recipe in recipes" :key="recipe.recipe_id">
          <a :href="'/recipes/' + recipe.recipe_id" target="_blank">{{ recipe.name }}</a>
        </li>
      </ul>
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
    };
  },
  async mounted() {
    this.recipes = await api.get_all_recipes()
  },
}
</script>
