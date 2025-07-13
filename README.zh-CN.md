# Jimmer 示例书店

[![Java](https://img.shields.io/badge/Java-21+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.0+-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.0+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[English](README.md) | [中文](README.zh-CN.md)

一个基于 Spring Boot、Jimmer ORM 和 Vue.js 构建的现代化全栈书店应用。本项目展示了完整的电商解决方案，包含用户认证、图书管理、社交功能和响应式网页界面。

## 🚀 功能特性

### 核心功能
- **图书管理**: 浏览、搜索和管理图书详细信息
- **作者系统**: 完整的作者档案和图书-作者关系
- **出版商管理**: 跟踪图书出版商及其目录
- **用户认证**: 基于 JWT 的安全认证系统
- **用户档案**: 包含联系信息的个人档案

### 社交功能
- **评论与评价**: 支持图书、作者和出版商的多级评论系统
- **投票系统**: 各种内容类型的点赞/点踩功能
- **收藏夹**: 保存和组织喜爱的图书、作者和出版商
- **标签系统**: 使用自定义标签对图书进行分类

### 内容管理
- **图片上传**: 支持图书封面和评论图片
- **公告系统**: 全站公告和通知
- **内容审核**: 基于角色的访问控制（用户/版主）

### 用户体验
- **响应式设计**: 使用 Naive UI 组件构建的现代界面
- **实时更新**: 使用 TanStack Query 进行高效的数据获取
- **类型安全**: 完整的 TypeScript 支持和生成的 API 类型
- **现代样式**: 使用 WindiCSS 工具类实现一致的设计

## 🛠 技术栈

### 后端
- **Spring Boot 3.x**: 核心应用框架
- **Jimmer ORM**: 基于 Kotlin DSL 的类型安全 SQL
- **PostgreSQL**: 主数据库
- **Spring Security**: 认证和授权
- **JWT**: 基于令牌的认证
- **Kotlin**: 主要编程语言

## 🔧 Jimmer ORM

**Jimmer** 是一个革命性的 ORM（对象关系映射）框架，为 Kotlin 和 Java 应用带来类型安全的 SQL。本项目展示了 Jimmer 的强大功能：

### 核心特性

- **类型安全 SQL**: 编写具有完整编译时类型检查的 SQL 查询
- **Kotlin DSL**: 用于构建复杂查询的自然 Kotlin 语法
- **自动生成类型**: 为前端集成自动生成 TypeScript 客户端
- **Spring Boot 集成**: 与 Spring Boot 应用的无缝集成
- **数据库无关**: 支持 PostgreSQL、MySQL、Oracle 等

### 本项目中的 Jimmer

书店应用充分利用了 Jimmer 的功能：

```kotlin
// 示例：使用 Jimmer 的类型安全查询
val books = sqlClient
    .createQuery(Book::class) {
        where(table.price gt 50.0)
        orderBy(table.name.asc())
        select(table)
    }
    .execute()
```

### 代码生成

Jimmer 自动生成：
- **TypeScript 类型**: 供前端使用的完整类型定义
- **API 客户端**: 类型安全的 HTTP 客户端代码
- **OpenAPI 文档**: 交互式 API 文档

### 优势

- **开发体验**: IntelliSense 支持和编译时错误检测
- **性能**: 优化的 SQL 生成和执行
- **可维护性**: 类型安全查询减少运行时错误
- **生产力**: 自动生成代码减少样板代码

### 🛠️ JimmerBuddy IntelliJ 插件

为了进一步提升 Jimmer 开发体验，我们强烈推荐安装 **JimmerBuddy** IntelliJ 插件

### 前端
- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: 类型安全开发
- **Naive UI**: 组件库
- **TanStack Query**: 数据获取和缓存
- **Vue Router**: 客户端路由
- **Pinia**: 状态管理
- **WindiCSS**: 实用优先的 CSS 框架
- **Vite**: 构建工具和开发服务器

### 开发工具
- **Gradle**: 后端构建系统
- **Vite**: 前端构建工具
- **Prettier**: 代码格式化
- **TypeScript**: 静态类型检查

## 📋 前置要求

在运行此项目之前，请确保您拥有：

- **Java 21+**: 用于 Spring Boot 后端
- **Node.js 18+**: 用于 Vue.js 前端
- **PostgreSQL 12+**: 数据库服务器
- **Git**: 版本控制

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone <repository-url>
cd jimmer-example-bookstore
```

### 2. 数据库设置

1. **安装 PostgreSQL** 并创建数据库：
```sql
CREATE DATABASE postgres;
CREATE SCHEMA bookstore;
```

2. **运行 DDL 脚本** 创建表：
```bash
psql -d postgres -f api/src/main/resources/ddl.sql
```

### 3. 后端设置

1. **导航到 API 目录**：
```bash
cd api
```

2. **在 `src/main/resources/application.properties` 中配置数据库连接**：
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres?currentSchema=bookstore
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **运行 Spring Boot 应用**：
```bash
./gradlew bootRun
```

后端将在 `http://localhost:8080` 启动

### 4. 前端设置

1. **导航到 web 目录**：
```bash
cd web
```

2. **安装依赖**：
```bash
bun install
```

3. **启动开发服务器**：
```bash
bun run dev
```

前端将在 `http://localhost:5173` 启动

## 📁 项目结构

```
jimmer-example-bookstore/
├── api/                          # 后端 Spring Boot 应用
│   ├── src/main/kotlin/
│   │   └── cn/enaium/bookstore/
│   │       ├── controller/       # REST API 控制器
│   │       ├── service/          # 业务逻辑服务
│   │       ├── model/           # 实体模型和 DTO
│   │       ├── config/          # 配置类
│   │       ├── error/           # 自定义错误处理
│   │       └── utility/         # 工具类
│   └── src/main/resources/
│       ├── application.properties
│       └── ddl.sql             # 数据库模式
├── web/                         # 前端 Vue.js 应用
│   ├── src/
│   │   ├── view/               # 页面组件
│   │   ├── layout/             # 布局组件
│   │   ├── common/             # 共享组件
│   │   ├── composables/        # Vue 组合式函数
│   │   ├── store/              # Pinia 存储
│   │   └── router/             # Vue Router 配置
│   └── src/__generated/        # 自动生成的 API 类型
└── README.md
```

## 🔧 配置

### 后端配置

`api/src/main/resources/application.properties` 中的关键配置选项：

```properties
# 数据库
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres?currentSchema=bookstore
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# Jimmer ORM
jimmer.show-sql=true
jimmer.pretty-sql=true
jimmer.client.ts.mutable=true

# 文件上传
bookstore.image.dir=images
```

### 前端配置

前端自动连接到后端 API。如需更改，请更新 `web/src/common/Api.ts` 中的 API 基础 URL。

## 🎯 API 文档

Jimmer 自动生成全面的 API 文档和客户端代码。后端运行后，您可以访问：

- **OpenAPI 文档**: `http://localhost:8080/docs/openapi.html` - 交互式 API 浏览器
- **TypeScript 客户端**: `http://localhost:8080/docs/ts.zip` - 下载自动生成的 TypeScript 类型
- **OpenAPI 规范**: `http://localhost:8080/docs/openapi.yml` - 原始 OpenAPI 规范

### 生成的代码

`web/src/__generated/` 目录包含 Jimmer 自动生成的所有代码：
- **API 服务**: 类型安全的 HTTP 客户端方法
- **类型定义**: 完整的 TypeScript 接口
- **错误处理**: 类型化的错误响应
- **请求/响应模型**: API 通信的完整类型安全

## 🧪 开发

### 后端开发

```bash
cd api
./gradlew bootRun          # 运行服务器
./gradlew test            # 运行测试
./gradlew build           # 构建 JAR
```

### 前端开发

```bash
cd web
bun run dev              # 启动开发服务器
bun run build            # 生产环境构建
```

### 代码生成

项目使用 Jimmer 的代码生成功能生成 TypeScript 类型：

```bash
cd web
./scripts/generate.ps1         # 生成 API 类型
```

## 🗄 数据库模式

应用使用全面的数据库模式，包含以下主要实体：

- **图书**: 包含版本和定价的核心产品信息
- **作者**: 包含性别和姓名信息的作者档案
- **出版商**: 出版商/出版公司信息
- **账户**: 用户认证和档案
- **评论**: 多级评论系统
- **投票**: 点赞/点踩功能
- **收藏**: 用户收藏系统
- **标签**: 分类系统
- **图片**: 图书封面和评论的图片管理

## 🔐 认证

应用使用基于 JWT 的认证，包含两种用户角色：

- **USER**: 具有基本权限的标准用户
- **MODERATOR**: 具有额外特权的管理用户

## 🎨 UI 组件

前端使用一致的设计系统：

- **Naive UI**: 专业组件库
- **WindiCSS**: 实用优先的样式
- **Vue Icons**: Fluent 图标集

## 📦 部署

### 后端部署

1. 构建 JAR 文件：
```bash
cd api
./gradlew build
```

2. 运行应用：
```bash
java -jar build/libs/jimmer-example-bookstore-0.0.1-SNAPSHOT.jar
```

### 前端部署

1. 构建生产包：
```bash
cd web
bun run build
```

2. 将 `dist` 文件夹部署到您的 Web 服务器

## Screenshots

![20250713220825](https://s2.loli.net/2025/07/13/DnrzjmMKiJhTSZU.png)
![20250713221142](https://s2.loli.net/2025/07/13/Le528iUjMcCNOPT.png)
![20250713221201](https://s2.loli.net/2025/07/13/naKlgdQHcU4rv8R.png)
![20250713221342](https://s2.loli.net/2025/07/13/iVShsOqcmPxAZdy.png)
![20250713221835](https://s2.loli.net/2025/07/13/dpXNHIhU3xVeS91.png)
![20250713221411](https://s2.loli.net/2025/07/13/PfjXEo2Ihb5VsYt.png)
![20250713221435](https://s2.loli.net/2025/07/13/Bge4fpz5q19DiJj.png)
![20250713221504](https://s2.loli.net/2025/07/13/1Dwb5YXfnAaLFzP.png)
![20250713222043](https://s2.loli.net/2025/07/13/l3bN91SrmCMqo7I.png)
![20250713222337](https://s2.loli.net/2025/07/13/eBUHbDSjLhmMYvd.png)

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- **Jimmer ORM**: 为 Kotlin 提供类型安全的 SQL
- **Spring Boot**: 为强大的后端框架
- **Vue.js**: 为渐进式前端框架
- **Naive UI**: 为精美的 UI 组件

---

**祝您编码愉快！📚✨** 