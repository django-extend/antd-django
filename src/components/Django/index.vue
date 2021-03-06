<template>
  <page-header-wrapper :title="false">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline" v-if="auth('view')">
          <a-row :gutter="48" v-if="metaInfo.filters">
            <a-col :md="8" :sm="24" v-for="filter in metaInfo.filters.listFilter" :key="filter.key">
              <a-form-item :label="filter.label">
                <a-select v-model="queryParam[filter.key]" @change="refreshData(true)">
                  <a-select-option key="">全部</a-select-option>
                  <a-select-option v-for="choice in filter.choices" :key="choice[0]">{{ choice[1] }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" v-if="metaInfo.filters.searchFields.length > 0">
              <a-input-search
                v-model="queryParam.search"
                :placeholder="formatPlaceholder(metaInfo.filters.searchFields)"
                @search="refreshData(true)"/>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-operator">
        <a-row type="flex">
          <a-col flex="auto">
            <a-row v-if="actions.items && actions.items.length!=0">
              <a-select style="min-width:100px" v-model="currentAction">
                <a-select-option key="">--------</a-select-option>
                <a-select-option v-for="item in actions.items" :key="item.action">{{ item.name }}</a-select-option>
              </a-select>
              <a-button style="margin-left:10px" type="primary" @click="handleBulkAction">{{ $t('execute') }}</a-button>
            </a-row>
          </a-col>
          <a-col flex="0px">
            <a-button type="primary" icon="plus" @click="handleAdd" v-if="auth('add')">{{ $t('create') }}</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table
        v-if="auth('view') && !loading"
        ref="table"
        size="default"
        :columns="columns"
        :pageSize="metaInfo.pageSize"
        :pagination="{showTotal:showTotal}"
        :data="loadData"
        :row-selection="actions.items && actions.items.length >0 ? { selectedRowKeys: selectedRowKeys, onChange: handleSelectChange } : null"
        rowKey="pk">
        <span slot="operate" slot-scope="_, record">
          <template v-if="auth('change')">
            <a @click="handleEdit(record)">{{ $t('edit') }}</a>
            <a-divider type="vertical" />
          </template>
          <template v-else-if="auth('view')">
            <a @click="handleView(record)">{{ $t('view') }}</a>
            <a-divider type="vertical" />
          </template>
          <a-popconfirm v-if="auth('delete')" :title="$t('confirm.delete')" @confirm="handleDelete(record)">
            <a>{{ $t('delete') }}</a>
          </a-popconfirm>
        </span>
        <template
          v-for="key in Object.keys(slots)"
          :slot="key"
          slot-scope="text"
        >
          <django-value
            :key="key"
            :value="text"
            :meta="getMeta(key)"
          />
        </template>
      </s-table>
      <edit-form
        :visible="visiblePopup"
        :sourceKey="editSourceKey"
        :metaInfo="metaInfo"
        @close="handleClosePopup"
      />
      <view-form
        :visible="visibleView"
        :sourceKey="editSourceKey"
        :metaInfo="metaInfo"
        @close="handleCloseView"
      />
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { STable } from '@/components'
import * as resource from '@/components/Django/api/resource'
import DjangoValue from './slots/DjangoValue'
import EditForm from './form/EditForm'
import ViewForm from './form/ViewForm'
import components from '@/utils/components'

export default ({
    components: { STable, EditForm, ViewForm, DjangoValue },
    data () {
        return {
            columns: [
            ],
            slots: {},
            queryParam: {
            },
            actions: {},
            loading: false,
            currentAction: '',
            selectedRowKeys: [],
            visiblePopup: false,
            visibleView: false,
            editSourceKey: '',
            metaInfo: {},
            loadData: parameter => {
                const { app, model } = this.getModelInfo()
                const noEmptyParams = Object.fromEntries(Object.entries(this.queryParam).filter(([key, value]) => value !== ''))
                const requestParameters = Object.assign({}, parameter, noEmptyParams)
                return resource.list(app, model, requestParameters).then(res => {
                  res.columns.forEach(column => {
                    const slotKey = column.dataIndex
                    this.slots[slotKey] = {
                      component: DjangoValue,
                      params: {}
                    }
                    column.scopedSlots = { customRender: slotKey }
                  })
                  this.columns = res.columns
                  this.columns.push({
                    title: '操作',
                    width: '150px',
                    scopedSlots: { customRender: 'operate' }
                  })
                  this.actions = res.actions
                  Object.keys(res.slots).forEach(key => {
                    const [component, params] = res.slots[key]
                    const item = {
                      key: key,
                      component: () => components.get(component),
                      params: params
                    }
                    this.slots[key] = item
                  })
                  return res.result
                })
            }
        }
    },
    watch: {
      // vue-router里面如果公用一个组件，页面切换是不会刷新数据的
      '$route': function () {
        this.resetData()
        this.readMetaInfo()
      }
    },
    created () {
      // 在列表页把模型的meta预加载一下，这样编辑页面不需要频繁请求options了
      this.readMetaInfo()
    },
    methods: {
      auth (action) {
        return this.$auth(`${this.$route.meta.permission}.${action}`)
      },
      getMeta (key) {
        return this.metaInfo ? this.metaInfo.actions.POST[key] : null
      },
      showTotal (total) {
        return `${total}条记录`
      },
      formatPlaceholder (source) {
        return source.map(item => {
          return item.label
        }).join('/')
      },
      refreshData (bool = false) {
        if (!this.auth('view')) {
          return
        }
        this.$refs.table && this.$refs.table.refresh(bool)
      },
      resetData () {
        this.selectedRowKeys = []
        this.actions = {}
        this.currentAction = ''
        this.columns = []
        this.slots = {}
        this.queryParam = {}
      },
      getModelInfo () {
        const [app, model] = this.$route.name.split('.')
        return {
          app: app,
          model: model
        }
      },
      async readMetaInfo () {
        this.loading = true
        this.metaInfo = await this.$store.dispatch('meta/getInfo', this.$route.name)
        this.metaInfo.filters.listFilter.forEach(filter => {
          this.queryParam[filter.key] = ''
        })
        this.loading = false
      },
      handleEdit (record) {
        this.editSourceKey = record.pk
        this.visiblePopup = true
      },
      handleView (record) {
        this.editSourceKey = record.pk
        this.visibleView = true
      },
      handleCloseView () {
        this.visibleView = false
      },
      handleAdd () {
        this.editSourceKey = ''
        this.visiblePopup = true
      },
      handleDelete (record) {
        const { app, model } = this.getModelInfo()
        const vm = this
        resource.del(app, model, record.pk).then(res => {
          vm.$message.success('记录已删除')
          vm.refreshData()
        })
      },
      handleClosePopup (needReloaded) {
        this.visiblePopup = false
        if (needReloaded) {
          this.refreshData()
        }
      },
      handleSelectChange (keys) {
        this.selectedRowKeys = keys
      },
      handleBulkAction () {
        if (this.currentAction === '') {
          return
        }
        const { app, model } = this.getModelInfo()
        const params = {
          ids: this.selectedRowKeys
        }
        resource.bulkAction(app, model, this.currentAction, params).then(res => {
          res.message.forEach(item => {
            let name
            switch (item.level) {
              case 20:
                name = 'info'
                break
              case 25:
                name = 'success'
                break
              case 30:
                name = 'warning'
                break
              case 40:
                name = 'error'
                break
              default:
                name = 'info'
                break
            }
            this.$message[name](item.message)
            this.refreshData()
          })
        })
      }
    }
})
</script>
