//         这是一个神奇的编译脚本
//         它读取CraftingUI.original.js的源码，然后做这些事情：

//         它会将下面的字符串file path替换为路径为file path的文件内容
//         /*@read-file*/"file path"

//         如果不加--debug参数执行，它会
//         删除@debug-only注释后的语句
//         删除所有包含@remove-comment的注释

//         最后，它输出CraftingUI.compiled.release.js，此源代码已经转换，符合IE8的语法规范

const debug = process.argv.indexOf('--debug') != -1

const babel = require('@babel/core')
const fs = require('fs')
const traverse = require("@babel/traverse").default

const source_path = 'CraftingUI.original.js'
const source = fs.readFileSync(source_path, {encoding:'utf-8'})
const parsedAst = babel.parseSync(source)

function ContainseMetaComment(node, _comment){
    if(node.leadingComments == undefined)
        return false
    for(let comment of node.leadingComments){
        if(comment.value == _comment)
            return true
    }
    return false
}

function NodeLoc(node){
    return `${source_path}:${node.loc.start.line}`
}
traverse(parsedAst,{
    Statement(path){
        if(debug == false){
            if(ContainseMetaComment(path.node,'@debug-only')){
                path.node.leadingComments.length = 0
                path.remove()
            }else
            if(ContainseMetaComment(path.node, '@remove-comment')){
                path.node.leadingComments.length = 0
            }    
        }
    },
    StringLiteral(path){
        if(ContainseMetaComment(path.node,'@read-file')){
            let filepath = path.node.value
            if(fs.existsSync(filepath)==false){
                console.error(`文件${filepath}不存在，导入失败(${NodeLoc(path.node)})`)
                exit(-1)
            }
            try{
                let text = fs.readFileSync(filepath,{encoding:'utf-8'}).split('\r\n').join('\n')
                path.node.value = text
                path.node.extra.raw = "'" + text.split('\n').join('\\n').split('\'').join('\\\'') + "'"
                path.node.extra.rawValue = text
            }catch(e){
                console.error(`文件${filepath}打开失败(${NodeLoc(path.node)})`)
                exit(-1)
            }
            path.node.leadingComments.length = 0
        }
    }
})

if(debug ){
    const compiled = babel.transformFromAstSync(parsedAst,{
    }).code    
    fs.writeFileSync('out/CraftingUI.compiled.debug.js',compiled)
}else{
    const compiled = babel.transformFromAstSync(parsedAst, source,{
        presets:[
            ['@babel/preset-env',{targets:['IE 8']}]
        ],
    }).code    
    fs.writeFileSync('out/CraftingUI.compiled.release.js',compiled)
}

