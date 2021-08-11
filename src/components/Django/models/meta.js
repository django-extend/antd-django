import * as resource from '@/components/Django/api/resource'
export default {
  namespaced: true,
  state: {
    informations: {}
  },
  mutations: {
    SET_INFO: (state, { key, value }) => {
      state.informations[key] = value
    }
  },
  actions: {
    getInfo ({ commit, state }, key) {
      return new Promise((resolve, reject) => {
        const value = state.informations[key]
        if (value) {
          resolve(value)
        } else {
          const [app, model] = key.split('.')
          resource.options(app, model).then(res => {
            commit('SET_INFO', { key: key, value: res })
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        }
      })
    }
  }
}
