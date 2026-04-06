# 工具目录

此目录包含开发所需的各种工具。

## natapp.exe - 内网穿透工具

用于将本地开发服务暴露到公网，方便远程测试和微信支付调试。

### 快速使用

```bash
# 方式1: 双击运行 start-natapp.bat
# 方式2: 双击运行 start-all.bat (启动所有服务)
# 方式3: 手动运行
cd tools
natapp.exe -authtoken=3d394aaec0bfe11d
```

### 配置信息

- **Authtoken**: 3d394aaec0bfe11d
- **域名**: http://yushiqi.nat100.top
- **本地端口**: 
  - 前端: 3000
  - 后端: 3001

### 隧道配置

需要在 natapp.cn 控制台配置两条隧道：

1. **前端隧道** (端口 3000)
   - 隧道类型: HTTP
   - 本地端口: 3000
   - 域名: yushiqi.nat100.top

2. **后端隧道** (端口 3001)
   - 隧道类型: HTTP
   - 本地端口: 3001
   - 域名: (需要另外申请或使用二级域名)

### 相关文件

- `natapp.conf` - Natapp 配置文件
- `start-natapp.bat` - 启动 Natapp 脚本

### 下载地址

- **官网**: https://natapp.cn/
- **下载页**: https://natapp.cn/#download
- **文档**: https://natapp.cn/article/natapp_newbie
