#!/bin/bash

# 设置环境变量
export OPENAI_API_KEY=sk-0a4318d5fcbf4aa8973fa16b22c80953
export OPENAI_BASE_URL=https://api.deepseek.com
export OPENAI_MODEL=deepseek-chat

# 进入项目目录
cd /home/ubuntu/english_grammar_tutor

# 启动服务
pnpm dev:server
