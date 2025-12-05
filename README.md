| Issues | License |  NPM  |
|--------|---------|-------|
[![Github Issues](https://img.shields.io/github/issues/wherewhere/bilibili-card)](https://github.com/wherewhere/bilibili-card/issues)|[![License](https://img.shields.io/github/license/wherewhere/bilibili-card)](https://github.com/wherewhere/bilibili-card/blob/main/LICENSE)|[![NPM Status](https://img.shields.io/npm/dt/bilibili-card.svg?style=flat)](https://www.npmjs.com/package/bilibili-card)

# bilibili-card

一个 Hexo 插件，在你的文章中插入哔哩哔哩卡片，样式模仿和借鉴自哔哩哔哩，基于 [hexo-bilibili-card](https://github.com/MaxChang3/hexo-bilibili-card)

[![NPM](https://nodei.co/npm/bilibili-card.png)](https://www.npmjs.com/package/bilibili-card)

## 安装

```sh
npm i bilibili-card
```

## 预览

<!-- Example Start -->
复制以下代码到 HTML 文件中查看

```html
<script type="module" src="https://unpkg.com/bilibili-card/dist/components/index.js" async></script>
<bilibili-card vid="BV1y54y1a768" type="video" title="【UWP】手把手教你安装 UWP 安装包" author="where-where"
  cover="http://i2.hdslb.com/bfs/archive/41bc750cb5011bb036e008a716a89158c7eb7bb5.jpg" duration="05:21" views="2.2万"
  danmakus="4" comments="75" favorites="253" coins="106" likes="287" info-types="views danmakus"
  theme="system"></bilibili-card>
```

SVG 预览

<a href="https://www.bilibili.com/video/BV1y54y1a768">
  <picture>
    <source media="(prefers-color-scheme: light)"
      srcset="https://github.com/user-attachments/assets/5eefc5bc-6ec7-4eb8-b76f-ab2d299646fe">
    <source media="(prefers-color-scheme: dark)"
      srcset="https://github.com/user-attachments/assets/34ceff84-f383-4555-bcc8-b1ca892d34ff">
    <img height="92" alt="【UWP】手把手教你安装 UWP 安装包"
      src="https://github.com/user-attachments/assets/5eefc5bc-6ec7-4eb8-b76f-ab2d299646fe">
  </picture>
</a>
<!-- Example End -->

## 使用

### 最低需求

- 支持 Web Components
- 支持 ES6 语法

### 使用 Web Components

在 Head 中引入

```html
<script type="module" src="https://unpkg.com/bilibili-card/dist/components/index.js" async></script>
```

在文章中插入

```html
<bilibili-card ...></bilibili-card>
```

其中

| 属性名 | 描述 | 默认值 |
|-------|------|-------|
| vid | 媒体 ID | 空 |
| type | 卡片类型 | video |
| title | 卡片标题 | 哔哩哔哩 (゜-゜)つロ 干杯~ |
| author | 作者 | 2233 |
| cover | 封面图片地址 | 空 |
| duration | 媒体时长 | ??:?? |
| views | 观看量 | 0 |
| danmakus | 弹幕数 | 0 |
| comments | 评论数 | 0 |
| favorites | 收藏数 | 0 |
| coins | 投币数 | 0 |
| likes | 点赞数 | 0 |
| info-types | 显示信息 | 根据卡片类型分配 |
| image-proxy | 图片代理地址 | https://images.weserv.nl/?url= |
| theme | 样式 | 空 |

### 使用 Vue 组件

你也可以直接使用 Vue 控件

```vue
<template>
  <BiliBiliCard :get-theme="getTheme" />
</template>

<script setup>
import { getTheme } from "bilibili-card/src/helpers/theme/index";
import BiliBiliCard from "bilibili-card/src/components/bilibili-card.vue";
</script>
```

其中属性同 Web Components

### 使用 Builder

你还可以使用 `bilibiliCardBuilder` 来生成 DOM 对象

```html
<link rel="stylesheet" href="https://unpkg.com/bilibili-card/src/styles/bilibili-card.css">
<div id="host"></div>
<script type="module">
  import { bilibiliCardBuilder } from "https://unpkg.com/bilibili-card/dist/tools/bilibili-card-builder/index.js";
  const card = bilibiliCardBuilder.createCard(
    undefined,
    "views danmakus",
    {
      vid: "BV1y54y1a768",
      title: "【UWP】手把手教你安装 UWP 安装包",
      author: "where-where",
      cover: "http://i2.hdslb.com/bfs/archive/41bc750cb5011bb036e008a716a89158c7eb7bb5.jpg",
      duration: "05:21",
      views: "2.2万",
      danmakus: "4",
      comments: "75",
      favorites: "253",
      coins: "106",
      likes: "287"
    }
  );
  document.getElementById("host").appendChild(card);
</script>
```

### 使用 Vue Plugin

你还可以将其作为 Vue 插件使用

在 `vite.config` 中引入
```js
import bilibiliCard from "bilibili-card/dist/lib/bilibili-card";

export default defineConfig({
  plugins: [
    bilibiliCard({
      image_proxy: "https://images.weserv.nl/?url="
    })
  ]
});
```

其中

| 选项名 | 描述 | 默认值 |
|-------|------|-------|
| image_proxy | 图片代理地址 | https://images.weserv.nl/?url= |

然后就可以在 Vue 中使用该组件了

```vue
<template>
  <BiliBiliCard theme="theme" />
</template>

<script setup>
import BiliBiliCard from "bilibili-card:{ID}?proxy=&type=&info-types=";
</script>
```

其中

| 属性名 | 描述 | 可选值 | 默认值 | 示例 |
|-------|------|-------|-------|-----|
| theme | 样式 | css 文件地址 | 空 | https://unpkg.com/bilibili-card/src/styles/bilibili-card.css |
| pathname | 媒体 ID | 视频：AV, BV；~~专栏：CV~~；番剧：MD；音频：AU | 空，将跳过生成 | BV1y54y1a768 |
| type | 卡片类型 | video, ~~article~~, user, live, bangumi, audio, dynamic, favorite, ~~album~~ | 自动识别 AV, BV, ~~CV~~, MD, AU，识别失败视为 video | video |
| info-types | 显示信息 | views, danmakus, comments, favorites, coins, likes | 空，由 bilibili-card 分配默认值 | views danmakus |

定义文件可导入

```ts
/// <reference types="bilibili-card/src/types/bilibili-card" />
```

或添加

```ts
declare module "bilibili-card:*" {
  import type { defineComponent, HTMLAttributes } from "vue";
  interface BilibiliCardProps extends HTMLAttributes {
    theme?: string;
  }
  const component: ReturnType<typeof defineComponent<BilibiliCardProps>>;
  export default component;
}
```

完整示例

```js
import BiliBiliCard from "bilibili-card:BV1y54y1a768?type=video&info-types=views danmakus";
```

## 配置

由于哔哩哔哩图片地址的跨域限制，因此需要配置图片代理，目前未找到大陆地区较为稳定的服务，默认使用的 `https://images.weserv.nl/?url=`，部分地区受到了 DNS 污染及反应过慢。建议参考 [rsstt-img-relay](https://github.com/Rongronggg9/rsstt-img-relay) 自建服务

## 引用及参考
- [jsdom](https://github.com/jsdom/jsdom "jsdom")
- [vue-shadow-dom](https://github.com/2A5F/shadow "shadow")
- [hexo-bilibili-card](https://github.com/MaxChang3/hexo-bilibili-card "hexo-bilibili-card")
- [哔哩哔哩-API收集整理](https://github.com/SocialSisterYi/bilibili-API-collect "BiliBili API Collect")

## 参与人员
[![Contributors](https://contrib.rocks/image?repo=wherewhere/bilibili-card)](https://github.com/wherewhere/bilibili-card/graphs/contributors)
