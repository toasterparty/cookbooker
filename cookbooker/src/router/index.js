import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import recipes from '../views/recipes.vue'
import recipe from '../views/recipe.vue'
import recipe_edit from '../views/recipe_edit.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: recipes
  },
  {
    path: '/recipes/:recipe_id',
    component: recipe
  },
  {
    path: '/edit/:recipe_id',
    component: recipe_edit
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
