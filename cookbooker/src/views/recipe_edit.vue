<style></style>

<template>
  <div class="recipe">
    <div v-if="recipe">
      <!-- Name -->
      <input v-model="recipe.name" type="text" />
      <!-- Save -->
      <button @click="save_recipe">Save</button>
    </div>
    <h1 v-else>⌛</h1>
  </div>
</template>

<script>
import * as api from '../lib/supabase_api'

export default {
  name: 'recipe_edit',
  data() {
    return {
      recipe_id: null,
      recipe: null,
      steps: null,
      ingredients: null,
    };
  },
  async created() {
    this.recipe_id = this.$route.params.recipe_id;
    this.recipe = await api.get_recipe(this.recipe_id);
    this.steps = await api.get_steps_for_recipe(this.recipe_id);
    this.ingredients = await api.get_ingredients_for_recipe(this.recipe_id);
  },
  methods: {
    async save_recipe() {
      try {
        api.update_recipe(this.recipe_id, this.recipe)
      } catch (error) {
        console.error('Failed to save recipe:', error);
        alert('Failed to save recipe.');
      }
    },
  },
}
</script>
