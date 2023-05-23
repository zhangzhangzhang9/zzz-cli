# 学习搭建cli脚手架

## 安装
### 全局安装
$ npm install -g zzz-cli
# or yarn
$ yarn global add zzz-cli

### 借助npx
创建模版
$ npx create zzz-cli <name> [-t|--template]
示例
$ npx create zzz-cli hello-cli -template dumi2-demo

## 使用
创建模版
$ zzz-cli create <name> [-t|--template]
示例
$ zzz-cli create hello-cli -t dumi2-demo
