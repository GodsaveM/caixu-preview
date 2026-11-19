# Caixu Preview · 采序手机手账原型

这份网页原型来自 Claude 导出的 `Caixu Preview.zip`。保留了原有脚本、图片和字体，首页包括 Recent Pages、My Journals 和 Quick Start Guide。左侧目录可以切换手机界面的各个交互流程。

## 本地打开

```powershell
git clone https://github.com/GodsaveM/caixu-preview.git
cd caixu-preview
Start-Process .\index.html
```

以后双击仓库根目录的 `index.html` 即可打开，也可以直接将它拖入浏览器。打开原型无需安装依赖、启动服务或登录 Claude。复制项目时应保留 `index.html` 同目录的脚本，以及 `img` 和 `f` 文件夹。

这个仓库用于预览交互界面。原生 iPhone SwiftUI 工程在 [caixu-ios](https://github.com/GodsaveM/caixu-ios)。
