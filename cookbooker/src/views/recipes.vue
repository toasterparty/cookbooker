<template>
  <div class="recipes">
    <h1>Recipes</h1>
    <div v-if="recipes.length === 0">
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

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const recipes = ref([])

async function getRecipes() {
  const { data } = await supabase.from('recipes').select()
  recipes.value = data
}

onMounted(() => {
  getRecipes()
})
</script>

<script>
export default {
  name: 'recipes'
}
</script>
