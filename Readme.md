# 说明

这是灰机wiki上合成袋模拟器的`js/css`程序源码。

它本身是一个css和一个js。但灰机的js不支持新的js语法，所以就使用Babel工程转换了一下，顺便给js加了一些模板展开的东西，具体展开的逻辑在`gen.js`文件中。

# 要求

- `python3`
- `nodejs`

# 构建方法

1. 解包游戏
2. 修改`gen.py`中的三个游戏路径
3. **在当前目录下**执行build.bat

# 调试方法

在wiki小工具设置中，关闭此工具来避免重复加载。

然后把`out\CraftingUI.compiled.debug.js`内容直接复制到网页控制台(F12)上。

# 上传wiki的文件

上传wiki的文件包括`CraftingUI.css`和`out\CraftingUI.compiled.release.js`。

# License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">知识共享署名-非商业性使用-相同方式共享 3.0 未本地化版本许可协议</a>进行许可。