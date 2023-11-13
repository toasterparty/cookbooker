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

.add-button {
  width: 75px;
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  z-index: 1000;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
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
      <!-- Image -->
      <div class="custom-input-container">
        <label class="custom-label">Image</label>
        <img
          :src="
            'https://kong.toasterparty.net/storage/v1/object/public/recipe-images/' +
            this.recipe.image
          "
          style="object-fit: contain; height: 400px; width: 400px"
        />
        <input type="file" @change="update_image" />
      </div>
      <!-- Preamble -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-preamble">Preamble</label>
        <textarea class="custom-textarea" id="recipe-preamble" v-model="recipe.preamble"></textarea>
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
      <!-- Ingredients -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-cook-time">Ingredients</label>
        <p
          v-for="(recipe_ingredient, recipe_ingredient_index) in recipe_ingredients"
          :key="recipe_ingredient_index"
        >
          <input
            class="custom-input"
            id="recipe-cook-time"
            v-model.number="recipe_ingredient.quantity"
            type="number"
          />
          <select
            v-model="selected_units[recipe_ingredient_index]"
            @change="update_recipe_ingredient_units(recipe_ingredient_index)"
          >
            <option v-for="(unit, unit_index) in units" :key="unit_index" :value="unit_index">
              {{ unit.name }}
            </option>
          </select>
          <select
            v-model="selected_ingredients[recipe_ingredient_index]"
            @change="update_recipe_ingredient_ingredient(recipe_ingredient_index)"
          >
            <option
              v-for="(ingredient, ingredient_index) in ingredients"
              :key="ingredient_index"
              :value="ingredient_index"
            >
              {{ ingredient.name }}
            </option>
            <option value="new">Add New...</option>
          </select>
        </p>

        <!-- Modal for adding custom ingredient -->
        <div v-if="show_new_ingredient_modal">
          <div class="modal-overlay" @click="hide_new_ingredient_modal"></div>
          <div class="modal">
            <label for="new_ingredient">Enter New Ingredient</label>
            <br />
            <input type="text" id="new_ingredient" v-model="new_ingredient" />
            <br />
            <button @click="add_new_ingredient">Add</button>
            <button @click="hide_new_ingredient_modal">Cancel</button>
          </div>
        </div>
        <!-- Add ingredient to the recipe -->
        <div class="custom-input-container">
          <button class="add-button" @click="add_ingredient_row">...</button>
        </div>
      </div>

      <br />
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
      recipe_ingredients: null,
      categories: null,
      image: null,
      units: null,
      selected_units: [],
      ingredients: null,
      selected_ingredients: [],
      show_new_ingredient_modal: false,
      new_ingredient: null,
      new_ingredient_index: null
    }
  },
  async created() {
    this.recipe_id = parseInt(this.$route.params.recipe_id)
    this.recipe = await api.get_recipe(this.recipe_id)
    this.steps = await api.get_steps_for_recipe(this.recipe_id)
    this.categories = await api.get_categories()
    this.units = await api.get_units()
    this.recipe_ingredients = await api.get_ingredients_for_recipe(this.recipe_id)

    await this.refresh_ingredients()
  },
  methods: {
    async refresh_ingredients() {
      this.ingredients = await api.get_ingredients()
      this.selected_units = []
      this.selected_ingredients = []

      for (const recipe_ingredient of this.recipe_ingredients) {
        /* Find and record which unit is selected for each recipe ingredient */
        var index = 0 // "Count"
        if (recipe_ingredient.units !== null) {
          index = this.units.findIndex((unit) => unit.unit_id === recipe_ingredient.units.unit_id)
          if (index === -1) {
            index = 0 // "Count"
          }
        }
        this.selected_units.push(index)

        /* Find and record which ingredient is selected for each recipe ingredient */
        index = null
        if (recipe_ingredient.ingredient_id !== null) {
          index = this.ingredients.findIndex(
            (ingredient) => ingredient.ingredient_id === recipe_ingredient.ingredient_id
          )
          if (index === -1) {
            index = null
          }
        }
        this.selected_ingredients.push(index)
      }
    },
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
        await api.update_recipe_ingredients(this.recipe_id, this.db_recipe_ingredients())
        // this.return_to_recipe()
      } catch (error) {
        console.error('Failed to save recipe:', error)
        alert('Failed to save recipe: ' + error)
      }
    },
    db_recipe_ingredients() {
      var db_recipe_ingredients = []
      for (const ingredient of this.recipe_ingredients) {
        db_recipe_ingredients.push({
          recipe_id: this.recipe_id,
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredient.quantity,
          unit_id: ingredient.units.unit_id
          // optional: false
        })
      }

      return db_recipe_ingredients
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
    update_image(event) {
      this.image = event.target.files[0]
    },
    update_recipe_ingredient_units(recipe_ingredient_index) {
      var unit_index = this.selected_units[recipe_ingredient_index]
      this.recipe_ingredients[recipe_ingredient_index].units = this.units[unit_index]
    },
    update_recipe_ingredient_ingredient(recipe_ingredient_index) {
      if (this.selected_ingredients[recipe_ingredient_index] === 'new') {
        this.show_new_ingredient_modal = true
        this.new_recipe_ingredient_index = recipe_ingredient_index
        return
      }

      var ingredient_index = this.selected_ingredients[recipe_ingredient_index]
      this.recipe_ingredients[recipe_ingredient_index].ingredient_id =
        this.ingredients[ingredient_index].ingredient_id
    },
    async add_new_ingredient() {
      // TODO: check for duplicate

      await api.add_ingredient({ name: this.new_ingredient })
      await this.refresh_ingredients()

      if (this.new_recipe_ingredient_index !== null) {
        var ingredient_index = this.ingredients.findIndex(
          (ingredient) => ingredient.name === this.new_ingredient
        )
        if (ingredient_index === -1) {
          throw new Error("Couldn't find " + this.new_ingredient + ' in database')
        }

        this.selected_ingredients[this.new_recipe_ingredient_index] = ingredient_index
        var ingredient_id = this.ingredients[ingredient_index].ingredient_id
        this.recipe_ingredients[this.new_recipe_ingredient_index].ingredient_id = ingredient_id
      }

      this.hide_new_ingredient_modal()
    },
    hide_new_ingredient_modal() {
      this.show_new_ingredient_modal = false
      this.new_ingredient = null
      this.new_recipe_ingredient_index = null
    },
    add_ingredient_row() {
      this.recipe_ingredients.push({
        ...this.recipe_ingredients[this.recipe_ingredients.length - 1]
      })
      this.refresh_ingredients()
    }
  }
}
</script>
