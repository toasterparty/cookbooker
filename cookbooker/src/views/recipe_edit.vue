<style>
.recipe {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.custom-label {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 5px;
  display: block;
}

.custom-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 80px;
  margin-bottom: 10px;
}

.custom-input-small {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  width: 55px;
  margin-bottom: 10px;
}

.custom-input-medium {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 300px;
}

.recipe-ingredient-button {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
  font-size: 18px;
  text-decoration: none;
  cursor: pointer;
}

.recipe-ingredient-button:hover {
  text-decoration: underline;
}

.button-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 25px;
}

.save-button,
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

.save-button:hover {
  background-color: #2c8f30;
}

.remove-button {
  color: #ffffff;
  background-color: #db8980;
  border: none;
  border-radius: 4px;
  width: 25px;
}

.remove-button:hover {
  background-color: #d46255;
}

.add-button {
  width: auto;
  min-width: 40px;
  background-color: #6ccf70;
  color: white;
  padding: 3px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12x;
}

.add-button:hover {
  background-color: #65c069;
}

button {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 5px;
  margin-left: 5px;
}

select {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 5px;
  margin-left: 5px;
}

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
  height: 180px;
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
  padding: 25px;
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
      <!-- Image -->
      <label class="custom-label">Image</label>
      <img
        v-if="this.recipe.image != null"
        :src="
          'https://kong.toasterparty.net/storage/v1/object/public/recipe-images/' +
          this.recipe.image
        "
        style="object-fit: contain; height: 500px; width: 500px"
      />
      <div>
        <input type="file" @change="update_image" />
      </div>
      <div v-if="this.recipe.image != null">
        <button @click="remove_image">Delete Image</button>
      </div>
      <!-- Preamble -->
      <label class="custom-label" for="recipe-preamble">Preamble</label>
      <textarea class="custom-textarea" id="recipe-preamble" v-model="recipe.preamble"></textarea>
      <!-- Servings -->
      <label class="custom-label" for="recipe-servings">Servings</label>
      <input
        class="custom-input"
        id="recipe-servings"
        v-model.number="recipe.servings"
        type="number"
      />
      <!-- Calories per Serving -->
      <label class="custom-label" for="recipe-calories">Calories per Serving</label>
      <input
        class="custom-input"
        id="recipe-calories"
        v-model.number="recipe.calories_per_serving"
        type="number"
      />
      <!-- Prep Time (minutes) -->
      <label class="custom-label" for="recipe-prep-time">Prep Time (minutes)</label>
      <input
        class="custom-input"
        id="recipe-prep-time"
        v-model.number="recipe.prep_time_m"
        type="number"
      />
      <!-- Cook Time (minutes) -->
      <label class="custom-label" for="recipe-cook-time">Cook Time (minutes)</label>
      <input
        class="custom-input"
        id="recipe-cook-time"
        v-model.number="recipe.cook_time_m"
        type="number"
      />
      <!-- Recipe Ingredients -->
      <label class="custom-label" for="recipe-ingredients">Ingredients</label>

      <p
        v-for="(recipe_ingredient, recipe_ingredient_index) in recipe_ingredients"
        :key="recipe_ingredient_index"
      >
        <button class="remove-button" @click="remove_ingredient_row(recipe_ingredient_index)">
          x
        </button>

        <input
          class="custom-input"
          id="recipe-ingredient-quantity"
          v-model.number="recipe_ingredient.quantity"
          type="number"
        /> <input
          type="checkbox"
          v-model="ingredient_checkboxes[recipe_ingredient_index]"
          @change="update_ingredient_checkbox(recipe_ingredient_index)"
        /> <input v-if="ingredient_checkboxes[recipe_ingredient_index]"
          class="custom-input-small"
          id="recipe-ingredient-quantity"
          v-model.number="recipe_ingredient.numerator"
          type="number"
        /> <span v-if="ingredient_checkboxes[recipe_ingredient_index]" >
        / </span> <input
          class="custom-input-small" v-if="ingredient_checkboxes[recipe_ingredient_index]"
          id="recipe-ingredient-quantity"
          v-model.number="recipe_ingredient.denominator"
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

        <button class="recipe-ingredient-button" @click="edit_ingredient(recipe_ingredient_index)">
          {{ recipe_ingredient.name }}
        </button>
      </p>

      <!-- Modal for editing ingredient for ingredient row -->
      <div v-if="show_edit_ingredient_modal">
        <div class="modal-overlay" @click="hide_edit_ingredient_modal"></div>
        <div class="modal">
          <label class="custom-label" style="margin-top: 0px" for="edit_ingredient"
            >Select Ingredient</label
          >

          <input
            style="display: block"
            type="text"
            class="textbox"
            id="ingredient_search"
            v-model="search_query"
            @input="search_ingredients"
            placeholder="Search..."
          />

          <!-- TODO: Why isn't this alphabetical? -->
          <p
            style="display: block"
            v-if="search_results && search_results.length"
            v-for="(ingredient, index) in search_results"
            :key="index"
          >
            <button
              class="recipe-ingredient-button"
              @click="select_ingredient(search_results[index])"
            >
              {{ ingredient.name }}
            </button>
          </p>

          <button
            v-if="show_add_new_ingredient_button"
            class="save-button"
            @click="create_ingredient_and_select"
          >
            Add New
          </button>
          <button class="cancel-button" @click="hide_edit_ingredient_modal">Cancel</button>
        </div>
      </div>

      <!-- Add ingredient to the recipe -->
      <div class="custom-input-container">
        <button class="add-button" @click="add_ingredient_row">+</button>
      </div>

      <!-- Steps -->
      <label class="custom-label" for="recipe-cook-time">Directions</label>
      <ol>
        <li v-for="(step, step_index) in steps" :key="step.step_num">
          <p>
            <button class="remove-button" @click="remove_step(step_index)">x</button>
            <select
              v-model="selected_step_types[step_index]"
              @change="update_step_type(step_index)"
            >
              <option
                v-for="(step_type, step_type_index) in step_types"
                :key="step_type_index"
                :value="step_type_index"
              >
                {{ step_type.name }}
              </option>
            </select>

            <br />

            <label>
              <input
                type="checkbox"
                v-model="duration_checkboxes[step_index]"
                @change="update_duration_checkbox(step_index)"
              />
              Duration (min):
            </label>

            <input
              v-if="step.duration_m !== null"
              class="custom-input"
              v-model.number="step.duration_m"
              type="number"
            />

            <br />

            <textarea
              class="custom-textarea"
              id="recipe-preamble"
              v-model="step.description"
            ></textarea>
          </p>
          <br />
        </li>
      </ol>

      <!-- Add step to directions -->
      <button class="add-button" @click="add_step">+</button>

      <!-- Source -->
      <div class="custom-input-container">
        <label class="custom-label" for="recipe-source">Source</label>
        <input class="custom-input-medium" id="recipe-source" v-model="recipe.source" type="text" />
      </div>

      <!-- Save -->
      <div class="button-container">
        <button class="save-button" @click="save_recipe">Save</button>
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
      ingredient_checkboxes: [],
      categories: null,
      image: null,
      units: null,
      step_types: null,
      selected_units: [],
      search_results: null,
      search_query: null,
      show_add_new_ingredient_button: false,
      selected_ingredients: [],
      show_edit_ingredient_modal: false,
      selected_step_types: [],
      duration_checkboxes: []
    }
  },
  async created() {
    this.recipe_id = parseInt(this.$route.params.recipe_id)
    this.recipe = await api.get_recipe(this.recipe_id)
    this.steps = await api.get_steps_for_recipe(this.recipe_id)
    this.categories = await api.get_categories()
    this.units = await api.get_units()
    this.step_types = await api.get_step_types()
    this.recipe_ingredients = await api.get_ingredients_for_recipe(this.recipe_id)

    this.refresh_step_types()
    await this.refresh_ingredients()
  },
  methods: {
    refresh_step_types() {
      for (const step of this.steps) {
        var index = this.step_types.findIndex(
          (step_type) => step_type.step_type_id === step.step_type_id
        )
        this.selected_step_types.push(index)
        this.duration_checkboxes.push(step.duration_m !== null)
      }
    },
    async refresh_ingredients() {
      this.selected_units = []
      this.ingredient_checkboxes = []

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
        this.ingredient_checkboxes.push(recipe_ingredient.numerator !== null && recipe_ingredient.denominator !== null)
      }
    },
    async save_recipe() {
      try {
        if (this.image) {
          if (this.recipe.image) {
            await api.delete_file(this.recipe.image)
            this.recipe.image = null
          }
          const filename = this.recipe.recipe_id + '-' + this.random_suffix(8) + '.jpg'
          await api.upload_file(this.image, filename)
          this.recipe.image = filename
        }
        await api.update_recipe(this.recipe_id, this.recipe)
        await api.update_recipe_ingredients(this.recipe_id, this.db_recipe_ingredients())
        await api.update_recipe_steps(this.recipe_id, this.db_recipe_steps())
        await api.update_steps(this.db_steps())

        this.return_to_recipe()
      } catch (error) {
        console.error('Failed to save recipe:', error)
        alert('Failed to save recipe: ' + error)
      }
    },
    random_suffix(length) {
      const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let randomFilename = ''

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length)
        randomFilename += validChars.charAt(randomIndex)
      }

      return randomFilename
    },
    db_recipe_ingredients() {
      var db_recipe_ingredients = []
      for (const ingredient of this.recipe_ingredients) {
        db_recipe_ingredients.push({
          recipe_id: this.recipe_id,
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredient.quantity,
          numerator: ingredient.numerator,
          denominator: ingredient.denominator,
          unit_id: ingredient.units.unit_id
          // optional: false
        })
      }

      return db_recipe_ingredients
    },
    db_recipe_steps() {
      var db_recipe_steps = []
      for (const step of this.steps) {
        db_recipe_steps.push({
          recipe_id: this.recipe_id,
          step_id: step.step_id,
          step_num: step.step_num
        })
      }

      return db_recipe_steps
    },
    db_steps() {
      var db_steps = []
      for (const step of this.steps) {
        db_steps.push({
          step_id: step.step_id,
          step_type_id: step.step_type_id,
          description: step.description,
          duration_m: step.duration_m,
          image: null
        })
      }

      return db_steps
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
      const targetSizeMB = 1.0
      const fileInput = event.target
      const file = fileInput.files[0]

      if (file) {
        const reader = new FileReader()

        reader.onload = (e) => {
          const img = new Image()
          img.src = e.target.result

          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // Calculate the compression ratio to achieve the target size
            const compressionRatio = (targetSizeMB * 1024 * 1024) / file.size
            const width = img.width * Math.sqrt(compressionRatio)
            const height = img.height * Math.sqrt(compressionRatio)

            canvas.width = width
            canvas.height = height

            // Draw the image on the canvas with the new dimensions
            ctx.drawImage(img, 0, 0, width, height)

            // Convert the canvas content to a compressed data URL
            const compressedDataURL = canvas.toDataURL('image/jpeg', 0.8) // Adjust the quality as needed (0.8 is just an example)

            // Convert the data URL back to a Blob object
            const compressedBlob = this.dataURLtoBlob(compressedDataURL)

            // Set the compressed image as the new value
            this.image = compressedBlob
          }
        }

        reader.readAsDataURL(file)
      }
    },
    // helper for above
    dataURLtoBlob(dataURL) {
      const arr = dataURL.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new Blob([u8arr], { type: mime })
    },
    remove_image() {
      this.recipe.image = null
    },
    update_recipe_ingredient_units(recipe_ingredient_index) {
      var unit_index = this.selected_units[recipe_ingredient_index]
      this.recipe_ingredients[recipe_ingredient_index].units = this.units[unit_index]
    },
    add_ingredient_row() {
      if (this.recipe_ingredients.length === 0) {
        this.recipe_ingredients.push({
          name: "<Select Ingredient>",
          ingredient_id: 0,
          quantity: 1,
          numerator: null,
          denominator: null,
          units: {
            unit_id: 0,
            name: "Count"
          }
        })
      } else {
        this.recipe_ingredients.push({
          ...this.recipe_ingredients[this.recipe_ingredients.length - 1]
        })
      }
      this.refresh_ingredients()
    },
    remove_ingredient_row(recipe_ingredient_index) {
      this.recipe_ingredients.splice(recipe_ingredient_index, 1)
      this.refresh_ingredients()
    },
    edit_ingredient(recipe_ingredient_index) {
      this.ingredient_to_edit = this.recipe_ingredients[recipe_ingredient_index]
      this.search_results = null
      this.search_query = null
      this.show_add_new_ingredient_button = false
      this.show_edit_ingredient_modal = true
    },
    async search_ingredients() {
      if (this.search_query === null) {
        this.search_results = null
        this.show_add_new_ingredient_button = false
        return
      }

      const trimmed_query = this.search_query.trim()
      if (trimmed_query.length === 0) {
        this.search_results = null
        this.show_add_new_ingredient_button = false
        return
      }

      this.search_results = await api.search_ingredient(trimmed_query)

      this.search_results.sort((a, b) => a.name > b.name)

      this.show_add_new_ingredient_button = !this.search_results.some(
        (result) => result.name.toLowerCase() === trimmed_query.toLowerCase()
      )
    },
    hide_edit_ingredient_modal() {
      this.show_edit_ingredient_modal = false
      this.ingredient_to_edit = null
    },
    select_ingredient(ingredient) {
      this.ingredient_to_edit.ingredient_id = ingredient.ingredient_id
      this.ingredient_to_edit.name = ingredient.name
      this.hide_edit_ingredient_modal()
    },
    async create_ingredient_and_select() {
      const ingredient = await api.insert_ingredient({ name: this.search_query.trim() })

      if (!ingredient) {
        console.error('insert_ingredient returned: ', ingredient)
        return
      }

      this.select_ingredient(ingredient[0])
    },
    update_ingredient_checkbox(index) {
      if (this.ingredient_checkboxes[index]) {
        this.recipe_ingredients[index].numerator = 1
        this.recipe_ingredients[index].denominator = 4
      } else {
        this.recipe_ingredients[index].numerator = null
        this.recipe_ingredients[index].denominator = null
      }
    },
    update_step_type(step_index) {
      var step_type_index = this.selected_step_types[step_index]
      this.steps[step_index].step_type_id = this.step_types[step_type_index].step_type_id
    },
    update_duration_checkbox(step_index) {
      if (this.duration_checkboxes[step_index]) {
        this.steps[step_index].duration_m = 0
      } else {
        this.steps[step_index].duration_m = null
      }
    },
    async add_step() {
      var step_id = await api.new_step()

      var max = 0
      for (const step of this.steps) {
        if (step.step_num > max) {
          max = step.step_num
        }
      }

      const new_step = {
        step_id: step_id,
        step_type_id: this.step_types[0].step_type_id,
        step_num: max + 1,
        description: '',
        duration_m: null,
        image: null
      }

      this.steps.push(new_step)
      this.selected_step_types.push(0)
      this.duration_checkboxes.push(new_step.duration_m !== null)
    },
    remove_step(step_index) {
      this.steps.splice(step_index, 1)
      this.selected_step_types.splice(step_index, 1)
      this.duration_checkboxes.splice(step_index, 1)
    }
  }
}
</script>
