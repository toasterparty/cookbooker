import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/home.vue'
import recipes from '../views/recipes.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router
