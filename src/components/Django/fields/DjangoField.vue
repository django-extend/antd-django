<template>
  <a-input-number v-if="meta.type==='integer'" :value="modelValue" @change="handleChange"/>
  <a-select v-else-if="meta.type==='choice'" :value="modelValue" @change="handleChange">
    <a-select-option v-for="choice in meta.choices" :key="choice.value">{{ choice.display_name }}</a-select-option>
  </a-select>
  <a-switch v-else-if="meta.type==='boolean'" :checked="modelValue" @change="handleChange"/>
  <a-date-picker
    v-else-if="meta.type==='date'"
    :value="formatDatetime(modelValue)"
    @change="handleChangeDatetime"
  />
  <a-date-picker
    v-else-if="meta.type==='datetime'"
    placeholder="请选择日期和时间"
    show-time
    :value="formatDatetime(modelValue)"
    @change="handleChangeDatetime"
  />
  <a-time-picker
    v-else-if="meta.type==='time'"
    :value="formatDatetime(modelValue, 'HH:mm:ss')"
    @change="handleChangeDatetime"
  />
  <a-input-number
    v-else-if="meta.type==='decimal'"
    :value="modelValue"
    :precision="meta.decimal_places"
    :step="getDecimalStep(meta.decimal_places)"
    @change="handleChange"
  />
  <django-file-field :value="modelValue" v-else-if="meta.type=='file upload'" :canDelete="!meta.required" @change="handleChange"/>
  <django-image-field :value="modelValue" v-else-if="meta.type=='image upload'" :canDelete="!meta.required" @change="handleChange"/>
  <foreign-select :value="modelValue" v-else-if="meta.type==='field' && meta.field_type==='ManyToOne'" :relation="meta.relation" @change="handleChange"/>
  <django-many-to-many-field
    :value="modelValue"
    v-else-if="meta.type==='field' && meta.field_type==='ManyToMany'"
    :choices="meta.choices"
    @change="handleChange"
  />
  <a-input-password v-else-if="meta.input_type==='password'" :value="modelValue" :maxLength="meta.max_length" @change="handleChangeInput"/>
  <a-textarea v-else-if="meta.input_type==='textarea'" :value="modelValue" @change="handleChangeInput"/>
  <a-input v-else :value="modelValue" :maxLength="meta.max_length" @change="handleChangeInput"/>
</template>
<script>
import ForeignSelect from './ForeignSelect'
import DjangoFileField from './DjangoFileField'
import DjangoImageField from './DjangoImageField'
import DjangoManyToManyField from './DjangoManyToManyField'
import moment from 'moment'
export default {
  components: { ForeignSelect, DjangoFileField, DjangoImageField, DjangoManyToManyField },
  // eslint-disable-next-line vue/require-prop-types
  props: ['modelValue', 'meta'],
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  methods: {
    getDecimalStep (precision) {
      let rs = 1
      for (let i = 0; i < precision; i++) {
        rs /= 10
      }
      return rs
    },
    formatDatetime (value, pattern = 'YYYYY-MM-DD HH:mm:ss') {
      return value ? moment(value, pattern) : null
    },
    handleChange (value) {
      this.$emit('change', value)
    },
    handleChangeInput (e) {
      this.$emit('change', e.target.value)
    },
    handleChangeDatetime (_, value) {
      this.$emit('change', value)
    }
  }
}
</script>
