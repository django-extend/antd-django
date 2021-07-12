<template>
  <a-card>
    <a-form-model ref="ruleForm" :model="form">
      <!-- <a-form-model-item labe="z" prop="z">
        <a-input v-model="form.z"/>
      </a-form-model-item> -->
      <a-form-model-item
        v-for="key in Object.keys(form)"
        :key="key"
        :prop="key"
        :rules="form[key].rules"
        :label="form[key].label">
        <a-input v-model="form[key].value"/>
      </a-form-model-item>
    </a-form-model>
    <a-button @click="handleTest">test</a-button>
    <a-button @click="handleSubmit">test2</a-button>
    <a-input-password :value="v" @change="handleChange2"/>
  </a-card>
</template>
<script>
export default {
  data () {
    return {
      form: {
        z: 1
      },
      v: '111',
      rules: {
        z: [
            { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleTest () {
      this.form = {
        z: {
          label: 'z',
          rules: [
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        a: { label: 'a' }
      }
      this.rules = {
        z: [
            { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    },
    handleChange (e) {
    },
    handleSubmit () {
      this.$refs.ruleForm.validate(valid => {
        console.log(valid)
      })
    },
    handleChange2 (v) {
      console.log(v)
    }
  }
}
</script>
