import { RouteView } from '@/layouts'

const components = {
  defaults: {
    'menu': RouteView,
    'dashboard': () => import('@/views/Dashboard'),
    'django': () => import('@/components/Django')
  },
  custom: {

  },
  get (key) {
    return this.custom[key] || this.defaults[key]
  }
}
export default components
