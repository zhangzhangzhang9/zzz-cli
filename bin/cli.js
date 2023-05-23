#! /usr/bin/env node

const inquirer = require('inquirer');
const program = require('commander');
const packages = require('../package.json');
// const templates = require('./templates');
const { getGitReposList } = require('./api.js') // 新增
const ora = require('ora') // 引入ora
const fs = require('fs-extra') // 引入fs-extra
const path = require("path")
const downloadGitRepo = require('download-git-repo')
// 获取目标文件夹
// 定义当前版本
program.version(`v${packages.version}`)
program.on('--help', () => { }) // 添加--help
program
  .command('create [projectName]') // [projectName]是可选 <projectName>是必填
  .description('创建模版')
  .option('-t, --template <template>', '模版名称') // 配置项 --template xxx
  .action(async (projectName, options) => {
    // 添加获取模版列表接口和loading
    const getRepoLoading = ora('获取模版列表...')
    getRepoLoading.start()
    const templates = await getGitReposList('zhangzhangzhang9')
    getRepoLoading.succeed('获取模版列表成功!')
    // projectName: 项目名称
    // options: 配置项 { template: string }
    // 1. 从模版列表中找到对应的模版
    let project = templates.find(template => template.name === options.template)
    // 2. 如果匹配到模版就赋值，没有匹配到就是undefined
    let projectTemplate = project ? project.value : undefined
    console.log('命令行参数：', projectName, projectTemplate)
    // 3. // 如果用户没有传入名称就交互式输入
    if (!projectName) {
      const { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "请输入项目名称：",
      })
      projectName = name // 赋值输入的项目名称
    }
    console.log("项目名称：", projectName)

    // 4. 如果用户没有传入模版就交互式输入
    if (!projectTemplate) {
      const { template } = await inquirer.prompt({
        type: 'list',
        name: 'template',
        message: '请选择模版：',
        choices: templates // 模版列表
      })
      projectTemplate = template // 赋值选择的项目名称
    }
    console.log('模版：', projectTemplate)
    
    const dest = path.join(process.cwd(), projectName)
    // 判断文件夹是否存在，存在就交互询问用户是否覆盖
    if (fs.existsSync(dest)) {
      console.log('文件是否存在:',fs.existsSync(dest))
      const { force } = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: '目录已存在，是否覆盖？',
      })
      // 如果覆盖就删除文件夹继续往下执行，否的话就退出进程
      force ? fs.removeSync(dest) : process.exit(1)
      if(!force) return
    }
    // 定义loading
    const loading = ora('正在下载模版...')
    // 开始loading
    loading.start()
    // 下载模版
    downloadGitRepo(projectTemplate, dest, (err) => {
      if (err) {
        loading.fail('创建模版失败：' + err.message) // 失败loading
      } else {
        loading.succeed('创建模版成功!') // 成功loading
        // 添加引导信息(每个模版可能都不一样，要按照模版具体情况来)
        console.log(`\ncd ${projectName}`)
        console.log('npm install')
        console.log('npm start or dev\n')
      }
    })
  });
// 解析用户执行命令传入参数
program.parse(process.argv)
