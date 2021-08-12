简体中文 | [English](./README.en-US.md)

<h1 align="center">Antd-Django</h1>
<div align="center">
Django Admin 的前端框架. 使用<a href="https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/" target="_blank">Ant Design of Vue</a>书写
</div>

### 后端依赖

> 后端依赖 <a href="https://github.com/django-extend/django-admin-api.git">django-admin-api</a>.
> 
> 需要先按照`django-admin-api`的向导建立一个后端项目（假设后端服务已经成功运行在http://localhost:8000）

### 前端项目安装

- 克隆仓库
```bash
git clone https://github.com/django-extend/antd-django.git my-project
cd my-project
```

github不稳定的话，国内可使用码云仓库
```
git clone https://gitee.com/django-extend/antd-django.git my-project
```

- 安装依赖

```
yarn install
```

国内网络可使用cnpm淘宝镜像加速
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
cnpm install webpack@4.1.0  # 降级webpack版本，否则项目会跑不出来，报这个错误"TypeError: Cannot read property 'get' of undefined"
```

- 编译并运行（开发环境）
```
npm run serve -- --port 5000 # 后端占用8000端口，前端指定5000端口
```
