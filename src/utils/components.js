import { RouteView } from '@/layouts'

const components = {
  defaults: {
    'menu': RouteView,
    'django': () => import('@/components/Django')
  },
  custom: {

  },
  get (key) {
    return this.custom[key] || this.defaults[key]
  }
}
export default components
