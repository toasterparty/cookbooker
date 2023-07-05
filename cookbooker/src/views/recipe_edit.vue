<style>
 .recipe {
    display: flex;
    flex-direction: column;
    align-items: left;
  }

  .custom-label {
    margin-right: 10px;
    font-size: 16px;
  }

  .custom-input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    width: 300px;
    margin-bottom: 10px;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }
  
  .custom-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .custom-button:hover {
    background-color: #45a049;
  }
</style>

<template>
  <div class="recipe">
    <div v-if="recipe">
      <!-- Name -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-name">Recipe Name</label>
        <input class="custom-input" id="recipe-name" v-model="recipe.name" type="text" @input="updateRecipeName" />
      </div>
      <!-- Save -->
      <div class="button-container">
        <button class="custom-button" @click="save_recipe">Save</button>
      </div>
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
    updateRecipeName(event) {
      this.recipe.name = event.target.value;
    },
  },
}
</script>
