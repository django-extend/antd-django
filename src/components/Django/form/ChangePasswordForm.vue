<template>
  <a-drawer
    :width="520"
    :visible="visible"
    @close="handleClose"
  >
    <span slot="title">
      修改{{ label }}
    </span>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item :label="label" prop="password">
        <a-input-password v-model="form.password"/>
      </a-form-model-item>
      <a-form-model-item prop="checkPassword">
        <span slot="label">
          {{ label }} (重复)
        </span>
        <a-input-password v-model="form.checkPassword"/>
      </a-form-model-item>
    </a-form-model>
    <div class="submit-tail">
      <a-button :style="{ marginRight: '8px' }" @click="handleClose">取消</a-button>
      <a-button type="primary" @click="handleSubmit" :loading="submitting">
        更新
      </a-button>
    </div>
  </a-drawer>
</template>
<script>
import * as resource from '@/components/Django/api/resource'
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    sourceKey: {
      type: String,
      required: true
    }
  },
  computed: {
    label: function () {
      return this.field.meta ? this.field.meta.label : ''
    }
  },
  data () {
    const checkPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      submitting: false,
      form: {
      },
      rules: {
        password: [{ required: true, message: '请输入', trigger: 'blur' }],
        checkPassword: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose () {
      this.$refs.ruleForm.resetFields()
      this.$emit('close')
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const vm = this
          vm.submitting = true
          const [app, model] = this.$route.name.split('.')
          const params = {}
          params[`${this.field.key}`] = this.form.password
          resource.update(app, model, this.sourceKey, params).then(res => {
            vm.$message.success('更新成功')
            vm.handleClose()
          }).finally(() => {
            vm.submitting = false
          })
        }
      })
    }
  }
}
</script>
