# 服务管理指南

## 🚀 后端服务管理

后端API服务现在使用 **PM2** 进行管理,确保稳定运行和自动重启。

---

## 📋 常用命令

### 查看服务状态
```bash
pm2 status
```

### 查看日志
```bash
# 实时查看日志
pm2 logs grammar-api

# 查看最近20行日志
pm2 logs grammar-api --lines 20
```

### 重启服务
```bash
pm2 restart grammar-api
```

### 停止服务
```bash
pm2 stop grammar-api
```

### 启动服务
```bash
pm2 start grammar-api
```

### 删除服务
```bash
pm2 delete grammar-api
```

### 查看详细信息
```bash
pm2 show grammar-api
```

---

## 🔧 重新部署

如果需要重新启动服务:

```bash
cd /home/ubuntu/english_grammar_tutor
pm2 restart grammar-api
```

---

## 🐛 故障排查

### 1. 服务无法启动

检查日志:
```bash
pm2 logs grammar-api --err --lines 50
```

### 2. 端口被占用

查看端口占用:
```bash
netstat -tuln | grep 3000
```

杀死占用进程:
```bash
lsof -ti:3000 | xargs kill -9
pm2 restart grammar-api
```

### 3. 环境变量问题

编辑启动脚本:
```bash
nano /home/ubuntu/english_grammar_tutor/start-backend.sh
```

确保包含:
```bash
export OPENAI_API_KEY=sk-0a4318d5fcbf4aa8973fa16b22c80953
export OPENAI_BASE_URL=https://api.deepseek.com
export OPENAI_MODEL=deepseek-chat
```

---

## ✅ 服务配置

- **服务名称**: grammar-api
- **端口**: 3000
- **启动脚本**: `/home/ubuntu/english_grammar_tutor/start-backend.sh`
- **日志目录**: `/home/ubuntu/.pm2/logs/`
- **自动重启**: 已启用
- **崩溃重启**: 已启用

---

## 📊 监控

### 实时监控
```bash
pm2 monit
```

### 查看资源使用
```bash
pm2 status
```

---

## 🔄 更新代码后

```bash
cd /home/ubuntu/english_grammar_tutor
git pull  # 如果使用git
pm2 restart grammar-api
```

---

## 💡 提示

- PM2会自动重启崩溃的进程
- 日志会自动轮转,不会占用过多空间
- 服务会在系统重启后自动启动(如果配置了startup)
