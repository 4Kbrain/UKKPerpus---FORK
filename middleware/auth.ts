import type { UserRole } from '~/types' // Assuming your types are in the `types` folder

export default defineNuxtRouteMiddleware((to, from) => {
  const { data, status } = useAuth()  

  // Debugging
  console.log("Auth Middleware Running - Status:", status.value)

  // Check if the user is authenticated
  if (status.value !== 'authenticated') {
    return navigateTo('/user/login')
  }

  const userRole = data.value?.role as UserRole

  // Define allowed roles for the page
  const allowedRoles = to.meta.allowedRoles as UserRole[] | undefined

  // Check if user role is in the allowed roles for the page
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return navigateTo('/') 
  }

  // Allow navigation if user has the correct role
})
