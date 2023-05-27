<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabaseClient'

const recipes = ref([])

async function getRecipes() {
  const { data } = await supabase.from('recipes').select()
  recipes.value = data
}

onMounted(() => {
  getRecipes()
})
</script>

<template>
  <div>
    <h1>Cookbooker</h1>
    <ul>
      <li v-for="recipe in recipes" :key="recipe.recipe_id">
        <a :href="'/recipes/' + recipe.recipe_id" target="_blank">{{ recipe.name }}</a>
      </li>
    </ul>
  </div>
</template>
