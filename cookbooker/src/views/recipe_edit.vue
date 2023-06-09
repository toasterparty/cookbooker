<style>
.recipe {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.custom-input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.custom-label {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 5px;
}

.custom-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 80px;
}

.custom-input-medium {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 300px;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 25px;
}

.custom-button,
.cancel-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.custom-button:hover,
.cancel-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #808080;
}

.cancel-button:hover {
  background-color: #737373;
}

.custom-textarea {
  width: 800px;
  height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

header > h1 {
  display: inline-block;
}

header span {
  margin-left: 3px;
  vertical-align: super;
  font-size: smaller;
}
</style>

<template>
  <div class="recipe">
    <div v-if="recipe">
      <!-- Name -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-name">Recipe Name</label>
        <input
          class="custom-input-medium"
          id="recipe-name"
          v-model="recipe.name"
          type="text"
          @input="update_recipe_name"
        />
      </div>
      <!-- Category -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-category">Category</label>
        <select
          class="custom-input-medium"
          id="recipe-category"
          v-model="recipe.category_id"
          @input="update_category"
        >
          <option
            v-for="category in categories"
            :key="category.category_id"
            :value="category.category_id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <!-- Preamble -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-preamble">Preamble</label>
        <textarea class="custom-textarea" id="recipe-preamble" v-model="recipe.preamble"></textarea>
      </div>
      <!-- Image -->
      <div class="custom-input-container">
        <label class="custom-label">Image</label>
        <input type="file" @change="upate_image">
      </div>
      <!-- Servings -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-servings">Servings</label>
        <input
          class="custom-input"
          id="recipe-servings"
          v-model.number="recipe.servings"
          type="number"
        />
      </div>
      <!-- Calories per Serving -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-calories">Calories per Serving</label>
        <input
          class="custom-input"
          id="recipe-calories"
          v-model.number="recipe.calories_per_serving"
          type="number"
        />
      </div>
      <!-- Prep Time (minutes) -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-prep-time">Prep Time (minutes)</label>
        <input
          class="custom-input"
          id="recipe-prep-time"
          v-model.number="recipe.prep_time_m"
          type="number"
        />
      </div>
      <!-- Cook Time (minutes) -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-cook-time">Cook Time (minutes)</label>
        <input
          class="custom-input"
          id="recipe-cook-time"
          v-model.number="recipe.cook_time_m"
          type="number"
        />
      </div>
      <!-- Source -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-source">Source</label>
        <input class="custom-input-medium" id="recipe-source" v-model="recipe.source" type="text" />
      </div>
      <!-- Save -->
      <div class="button-container">
        <button class="custom-button" @click="save_recipe">Save</button>
        <button class="cancel-button" @click="return_to_recipe">Cancel</button>
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
      categories: null,
      image: null
    }
  },
  async created() {
    this.recipe_id = this.$route.params.recipe_id
    this.recipe = await api.get_recipe(this.recipe_id)
    this.steps = await api.get_steps_for_recipe(this.recipe_id)
    this.ingredients = await api.get_ingredients_for_recipe(this.recipe_id)
    this.categories = await api.get_categories()
  },
  methods: {
    async save_recipe() {
      try {
        if (this.image) {
          if (this.recipe.image) {
            await api.delete_file(this.recipe.image)
            this.recipe.image = null
          }
          const filename = this.recipe.recipe_id + '-' + this.image.name
          await api.upload_file(this.image, filename)
          this.recipe.image = filename
        }
        await api.update_recipe(this.recipe_id, this.recipe)
        window.location.href = '/recipes/' + this.recipe_id
      } catch (error) {
        console.error('Failed to save recipe:', error)
        alert('Failed to save recipe: ' + error)
      }
    },
    return_to_recipe() {
      window.location.href = '/recipes/' + this.recipe_id
    },
    update_recipe_name(event) {
      this.recipe.name = event.target.value
    },
    update_category(event) {
      this.recipe.category_id = event.target.value
    },
    upate_image(event) {
      this.image = event.target.files[0];
    },
  }
}
</script>
