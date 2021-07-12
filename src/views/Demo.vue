<template>
  <a-card>
    <a-form-model
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        v-for="(item, index) in items"
        :key="item.key"
        :prop="'items.' + index + '.value'"
        :rules="item.rules"
      >
        <span slot="label">
          {{ item.meta.label }}
        </span>
        <django-field :meta="item.meta" v-model="item.value"/>
      </a-form-model-item>
      <a-divider orientation="left">
      </a-divider>
      <a-form-model-item label="filefield">
        <django-image-field v-model="testValue" :canDelete="false"/>
      </a-form-model-item>
    </a-form-model>
    <a-divider/>
    <a-button @click="handleTest">test</a-button>
    <a-divider/>
    <a-upload :file-list="formatFilelist(value)" :remove="handleRemove" :before-upload="beforeUpload" :showUploadList="{showRemoveIcon: false}">
      <a-button> <a-icon type="upload" /> Select File </a-button>
    </a-upload>
  </a-card>
</template>
<script>
import DjangoField from '@/components/Django/fields/DjangoField'
import DjangoImageField from '@/components/Django/fields/DjangoImageField'
import moment from 'moment'
// import * as resource from '@/api/resource'

export default {
  components: { DjangoField, DjangoImageField },
  data () {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      fileList: [
      ],
      defaultFileList: [
        {
          uid: '1',
          name: 'xxx.png',
          url: 'http://www.baidu.com'
        },
        {
          uid: '2',
          name: 'xxxx.png'
        }
      ],
      value: '',
      testValue: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      testAge: null,
      items: [
        {
          value: [10],
          meta: {
            type: 'field',
            fieldType: 'ManyToMany',
            label: 'abc',
            choices: {
                    '1': 'admin | 日志记录 | Can add log entry',
                    '2': 'admin | 日志记录 | Can change log entry',
                    '3': 'admin | 日志记录 | Can delete log entry',
                    '4': 'admin | 日志记录 | Can view log entry',
                    '9': 'auth | 组 | Can add group',
                    '10': 'auth | 组 | Can change group',
                    '11': 'auth | 组 | Can delete group',
                    '12': 'auth | 组 | Can view group',
                    '5': 'auth | 权限 | Can add permission',
                    '6': 'auth | 权限 | Can change permission',
                    '7': 'auth | 权限 | Can delete permission',
                    '8': 'auth | 权限 | Can view permission',
                    '13': 'auth | 用户 | Can add user',
                    '14': 'auth | 用户 | Can change user',
                    '15': 'auth | 用户 | Can delete user',
                    '16': 'auth | 用户 | Can view user',
                    '17': 'contenttypes | 内容类型 | Can add content type',
                    '18': 'contenttypes | 内容类型 | Can change content type',
                    '19': 'contenttypes | 内容类型 | Can delete content type',
                    '20': 'contenttypes | 内容类型 | Can view content type',
                    '45': 'myapp | 汽车 | Can add 汽车',
                    '46': 'myapp | 汽车 | Can change 汽车',
                    '47': 'myapp | 汽车 | Can delete 汽车',
                    '48': 'myapp | 汽车 | Can view 汽车',
                    '25': 'myapp | 城市 | Can add 城市',
                    '26': 'myapp | 城市 | Can change 城市',
                    '27': 'myapp | 城市 | Can delete 城市',
                    '28': 'myapp | 城市 | Can view 城市',
                    '29': 'myapp | my row | Can add my row',
                    '30': 'myapp | my row | Can change my row',
                    '31': 'myapp | my row | Can delete my row',
                    '32': 'myapp | my row | Can view my row',
                    '33': 'myapp | my row2 | Can add my row2',
                    '34': 'myapp | my row2 | Can change my row2',
                    '35': 'myapp | my row2 | Can delete my row2',
                    '36': 'myapp | my row2 | Can view my row2',
                    '37': 'myapp | my row3 | Can add my row3',
                    '38': 'myapp | my row3 | Can change my row3',
                    '39': 'myapp | my row3 | Can delete my row3',
                    '40': 'myapp | my row3 | Can view my row3',
                    '49': 'myapp | my row4 | Can add my row4',
                    '50': 'myapp | my row4 | Can change my row4',
                    '51': 'myapp | my row4 | Can delete my row4',
                    '52': 'myapp | my row4 | Can view my row4',
                    '53': 'myapp | my row5 | Can add my row5',
                    '54': 'myapp | my row5 | Can change my row5',
                    '55': 'myapp | my row5 | Can delete my row5',
                    '56': 'myapp | my row5 | Can view my row5',
                    '41': 'myapp | 测试表 | Can add 测试表',
                    '42': 'myapp | 测试表 | Can change 测试表',
                    '43': 'myapp | 测试表 | Can delete 测试表',
                    '44': 'myapp | 测试表 | Can view 测试表',
                    '21': 'sessions | 会话 | Can add session',
                    '22': 'sessions | 会话 | Can change session',
                    '23': 'sessions | 会话 | Can delete session',
                    '24': 'sessions | 会话 | Can view session'
                },
            relation: {
              app: 'myapp',
              model: 'mycity',
              lazy: true
            }
          }
        },
        {
          meta: {
            type: 'file upload',
            label: 'date',
            required: true,
            decimal_places: 4
          }
        }
      ]
    }
  },
  methods: {
    formatFilelist (value) {
      if (!value) {
        return []
      }
      if (typeof value === 'object') {
        return [value]
      }
      return [
        {
          uid: 1,
          name: value
        }
      ]
    },
    valueDate (value) {
      const rs = value ? moment(value, 'h:mm:ss') : null
      return rs
    },
    beforeUpload (file) {
      console.log('file', file)
      console.log(file instanceof File)
      this.value = file
      return false
    },
    handleTest () {
      console.log(this.testValue, this.testAge)
    },
    handleRemove () {
      this.value = null
    },
    handleUpload (value) {
      console.log(value)
    }
  }
}
</script>
