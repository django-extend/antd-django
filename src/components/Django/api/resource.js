import request from '@/utils/request'

export function options (app, model) {
  return request({
    url: `resource/${app}/${model}/`,
    method: 'options'
  })
}

export function list (app, model, params) {
  return request({
    url: `resource/${app}/${model}/`,
    method: 'get',
    params: params
  })
}

export function get (app, model, key) {
  return request({
    url: `resource/${app}/${model}/${key}/`,
    method: 'get'
  })
}

export function getStr (app, model, key) {
  return request({
    url: `resource/${app}/${model}/${key}/str/`,
    method: 'get'
  })
}

export function getView (app, model, key) {
  return request({
    url: `resource/${app}/${model}/${key}/view/`,
    method: 'get'
  })
}

export function getFilters (app, model) {
  return request({
    url: `resource/${app}/${model}/filters/`,
    method: 'get'
  })
}

export function listAutoComplete (app, model, params) {
  return request({
    url: `resource/${app}/${model}/autocomplete/`,
    method: 'get',
    params: params
  })
}

export function add (app, model, params) {
  return request({
    url: `resource/${app}/${model}/`,
    method: 'POST',
    data: params
  })
}

export function update (app, model, key, params) {
  return request({
    url: `resource/${app}/${model}/${key}/`,
    method: 'patch',
    data: params
  })
}

export function bulkAction (app, model, action, params) {
  return request({
    url: `resource/${app}/${model}/${action}/`,
    method: 'POST',
    data: params
  })
}

export function del (app, model, key) {
  return request({
    url: `resource/${app}/${model}/${key}/`,
    method: 'DELETE'
  })
}
