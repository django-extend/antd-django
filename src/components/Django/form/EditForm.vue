<template>
  <a-drawer
    :width="720"
    :visible="visible"
    @close="handleClose"
  >
    <span slot="title">
      {{ sourceKey === "" ? $t('create'): $t('edit') }}
    </span>
    <a-form-model
      ref="ruleForm"
      :model="source"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      v-show="!loading"
    >
      <div v-for="fieldset in fieldsets" :key="fieldset[0]">
        <a-divider v-if="fieldset[0]" orientation="left" :key="fieldset[0]">{{ fieldset[0] }}</a-divider>
        <a-form-model-item
          v-for="key in fieldset[1].fields"
          :key="key"
          :prop="'items.' + source.maps[key].index + '.value'"
          :rules="source.maps[key].rules"
          :validate-status="source.maps[key].validateStatus"
          :help="source.maps[key].help"
        >
          <span slot="label">
            {{ source.maps[key].meta.label }}
          </span>
          <a-button v-if="editMode && source.maps[key].meta.input_type==='password'" @click="handleChangePassword(source.maps[key])">修改</a-button>
          <django-field v-else :meta="source.maps[key].meta" v-model="source.items[source.maps[key].index].value"/>
        </a-form-model-item>
      </div>
    </a-form-model>
    <div class="submit-tail">
      <a-button :style="{ marginRight: '8px' }" @click="handleClose">{{ $t('cancel') }}</a-button>
      <a-button type="primary" @click="handleSubmit" :loading="submitting">
        {{ $t('submit') }}
      </a-button>
    </div>
    <change-password-form
      :visible="changePasswordVisible"
      :field="changePasswordSource"
      :sourceKey="sourceKey"
      @close="changePasswordVisible=false"/>
  </a-drawer>
</template>
<script>
import * as resource from '@/components/Django/api/resource'
import DjangoField from '@/components/Django/fields/DjangoField'
import ChangePasswordForm from '@/components/Django/form/ChangePasswordForm'
export default {
  components: { DjangoField, ChangePasswordForm },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    sourceKey: {
      type: String,
      required: true
    },
    metaInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      submitting: false,
      editMode: false,
      fieldsets: [],
      source: {
        maps: {},
        items: [
        ]
      },
      changePasswordVisible: false,
      changePasswordSource: {}
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        return
      }
      this.editMode = !!this.sourceKey
      if (this.editMode) {
        const vm = this
        vm.loading = true
        const [app, model] = this.$route.name.split('.')
        if (vm.sourceKey) {
          resource.get(app, model, vm.sourceKey).then(res => {
            vm.bind(res)
          })
          .finally(() => {
            vm.loading = false
          })
        }
      } else {
        this.bind()
      }
    }
  },
  methods: {
    buildParams () {
      let params
      if (this.haveFile(this.source.items)) {
        params = new FormData()
      } else {
        params = {}
      }
      return params
    },
    appendParam (params, key, value) {
      if (value === undefined || value === null) {
        // undefined是新增模式，null是编辑模式服务端返回
        return
      }
      if (params instanceof FormData) {
        if (Array.isArray(value)) {
          params.append(`${key}[]`, value)
        } else {
          params.append(key, value)
        }
      } else {
        params[key] = value
      }
    },
    isFileTypeField (item) {
      const fileTypeFields = ['file upload', 'image upload']
      return fileTypeFields.indexOf(item.meta.type) >= 0
    },
    haveFile (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.value instanceof File) {
          return true
        }
      }
      return false
    },
    makeRules (meta) {
      if (this.editMode && meta.input_type === 'password') {
        return []
      }
      if (!meta.required) {
        return []
      }
      return [{ required: true, message: '请输入', trigger: 'blur' }]
    },
    insertItem (key, meta) {
      const item = {
        key: key,
        meta: meta,
        validateStatus: '',
        help: '',
        index: this.source.items.length,
        rules: this.makeRules(meta),
        value: meta.default
      }
      this.source.items.push(item)
      this.source.maps[item.key] = item
      return item
    },
    bind (values) {
      this.resetData()
      const fieldInfos = this.metaInfo.actions.POST
      Object.keys(fieldInfos).forEach(key => {
        if (key === 'pk') { return true }
        const meta = fieldInfos[key]
        if (meta.read_only) { return true }
        const item = this.insertItem(key, meta)
        if (values) {
          item.value = values[key]
        }
      })
      if (this.editMode) {
        this.fieldsets = this.metaInfo.fieldsets
      } else {
        let sourceFieldsets = this.metaInfo.addFieldsets
        if (sourceFieldsets.length === 0) {
          sourceFieldsets = this.metaInfo.fieldsets
        }
        const fieldsets = []
        sourceFieldsets.forEach(item => {
          const fields = []
          item[1].fields.forEach(name => {
            fields.push(name)
            const fieldItem = this.source.maps[name]
            if (fieldItem.meta.input_type === 'password') {
              const key = `_check_${fieldItem.key}`
              const meta = Object.assign({}, fieldItem.meta)
              meta.label = `${meta.label}(重复)`
              const checkItem = this.insertItem(key, meta)
              const func = (rule, value, callback) => {
                const dst = fieldItem.value
                if (value !== dst) {
                  callback(new Error('密码输入不一致'))
                } else {
                  callback()
                }
              }
              checkItem.rules.push({ validator: func, trigger: 'blur' })
              fields.push(key)
            }
          })
          fieldsets.push([item[0], { fields: fields }])
        })
        this.fieldsets = fieldsets
      }
    },
    resetData () {
      this.source.items = []
      this.source.maps = {}
      this.fieldsets = []
    },
    echoError (err) {
      if (err.response) {
        const status = err.response.status
        if (status === 500) {
          this.$message.error('服务器内部错误')
          return
        }
        const data = err.response.data
        if (Array.isArray(data)) {
          data.forEach(item => {
            this.$message.error(item)
          })
          return
        }
        for (const key in data) {
          const item = this.source.maps[key]
          item.validateStatus = 'error'
          item.help = err.response.data[key][0]
        }
      }
    },
    handleClose () {
      this.resetData()
      this.$emit('close')
    },
    handleChangePassword (source) {
      this.changePasswordSource = source
      this.changePasswordVisible = true
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const [app, model] = this.$route.name.split('.')
          const vm = this
          this.submitting = true
          const params = this.buildParams()
          this.source.items.forEach(item => {
            item.validateStatus = ''
            item.help = ''
            if (!this.isFileTypeField(item)) {
              // 普通字段处理简单
              this.appendParam(params, item.key, item.value)
              return true
            }
            // 文件类型处理逻辑比较复杂
            if (!this.editMode) {
              // 新增模式，有上传文件才填充
              if (item.value) {
                this.appendParam(params, item.key, item.value)
              }
            } else {
              // 编辑模式
              if (item.value) {
                // 有值的情况有2种：1. 上传新文件，value是File类型，2.保持不变，value是字符串类型
                if (item.value instanceof File) {
                  // 上传新文件才需要填充
                  this.appendParam(params, item.key, item.value)
                }
              } else {
                // 无值的情况，有可能是没上传，也可能是删除原文件，这种情况增加一个隐藏字段，让后端去判断删除
                this.appendParam(params, `__del__${item.key}`, item.value)
              }
            }
          })
          const async = this.editMode ? resource.update(app, model, this.sourceKey, params) : resource.add(app, model, params)
          async.then(res => {
            vm.$message.success(vm.editMode ? '更新成功' : '添加成功')
            vm.resetData()
            vm.$emit('close', true)
          })
          .catch(err => {
            vm.echoError(err)
          })
          .finally(() => {
            vm.submitting = false
          })
        }
      })
    }
  }
}
</script>
