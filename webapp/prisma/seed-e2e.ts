import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.lpImage.deleteMany();
  await prisma.landingPage.deleteMany();

  const climbing = await prisma.category.create({
    data: { name: "クライミング", slug: "climbing" },
  });
  const urban = await prisma.category.create({
    data: { name: "都市・文化", slug: "urban" },
  });
  const gear = await prisma.category.create({
    data: { name: "ギア・道具", slug: "gear" },
  });
  await prisma.category.create({
    data: { name: "登山・ハイキング", slug: "hiking" },
  });

  const tagData = [
    { name: "岩場", slug: "crag" },
    { name: "ボルダリング", slug: "bouldering" },
    { name: "トレーニング", slug: "training" },
    { name: "東京", slug: "tokyo" },
    { name: "レビュー", slug: "review" },
  ];
  const tags = await Promise.all(
    tagData.map((t) => prisma.tag.create({ data: t }))
  );

  const articles = [
    {
      title: "瑞牆山・不動沢でクラックデビュー",
      slug: "mizugaki-crack-debut",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-04-10"),
      categoryId: climbing.id,
      tagSlugs: ["crag", "training"],
      body: `先週末、初めてクラッククライミングに挑戦してきた。

## 場所

山梨県の瑞牆山・不動沢エリア。花崗岩の美しいクラックが走る、国内屈指のクラックゲレンデだ。

## 感想

ジャミングの感覚がまったくわからず、最初の1本は散々だった。
しかし3本目あたりから、手のひらを岩に押しつける感覚が少しつかめてきた。

> 「クラックは嘘をつかない」とビレイヤーに言われた。確かにそうだと思う。

## 次の課題

- ハンドジャムの精度を上げる
- フィストジャムに慣れる
- 5.10台のクラックを完登する

岩と対話するような、不思議な充実感があった。`,
    },
    {
      title: "アラフィフがボルダリングを始めて1年",
      slug: "bouldering-one-year",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-03-22"),
      categoryId: climbing.id,
      tagSlugs: ["bouldering", "training"],
      body: `48歳でボルダリングを始めて、気づけば1年が経った。

## 体の変化

体重が3kg減り、握力が右手で12kgも上がった。
腰痛がほぼなくなったのは予想外の収穫だった。

## グレードの推移

| 時期 | 到達グレード |
|------|-------------|
| 1ヶ月目 | 5級 |
| 3ヶ月目 | 4級 |
| 6ヶ月目 | 3級 |
| 1年目 | 2級（惜しい） |

## 気づいたこと

若い頃の運動経験より、**継続する習慣**の方が大事だと実感している。
週3回、1時間ずつ。これだけで人は変わる。`,
    },
    {
      title: "丸の内・大手町界隈の再開発をウォッチする",
      slug: "marunouchi-urban-watch",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-03-05"),
      categoryId: urban.id,
      tagSlugs: ["tokyo"],
      body: `東京の中心部は今、大規模な再開発の真っ只中にある。

## 注目エリア

### 大手町フィナンシャルシティ周辺

かつて官庁街だった場所が、次々とオフィスビルとホテルに変わっている。
低層部には緑地が設けられ、「都市の森」という言葉が頻繁に使われる。

### 常盤橋タワー

2021年に開業したこのビルは、隣接する公園とともに新しい都市空間を作り出している。

## 思うこと

垂直方向に伸びるビルと、水平方向に広がる岩壁——
どちらも人間が「高さ」に魅了されてきた証拠だと、クライマーの目には映る。`,
    },
    {
      title: "La Sportiva スクワマを半年使ってみた",
      slug: "lasportiva-skwama-review",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-18"),
      categoryId: gear.id,
      tagSlugs: ["review"],
      body: `ボルダリング用シューズとして購入したLa Sportiva スクワマのレビュー。

## スペック

- タイプ: アグレッシブ
- クロージャー: ベルクロ×2
- ラバー: Vibram XS Grip2

## 半年使った感想

### 良い点

1. **ヒールフック**が抜群に決まる
2. **スメアリング**の感触が良い
3. 剛性があり、ポケットホールドで安定感がある

### 気になる点

- 幅が狭いため、幅広の足には合わない場合がある
- 初期は痛みがあるが、1〜2ヶ月で馴染んでくる

## 結論

ボルダリング特化でこれ以上の選択肢はなかなかない。
初めてのアグレッシブシューズとして十分おすすめできる。`,
    },
    {
      title: "奥多摩・川苔山で初冬のロングハイク",
      slug: "okutama-kawanori-hike",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-02-02"),
      categoryId: climbing.id,
      tagSlugs: ["crag"],
      body: `冬枯れの川苔山を歩いてきた。`,
    },
    {
      title: "渋谷再開発の現在地",
      slug: "shibuya-redev-now",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-01-20"),
      categoryId: urban.id,
      tagSlugs: ["tokyo"],
      body: `渋谷の再開発はどこまで来たのか。`,
    },
    {
      title: "Black Diamond Momentum の使用感",
      slug: "bd-momentum-impression",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-01-05"),
      categoryId: gear.id,
      tagSlugs: ["review"],
      body: `初心者向けハーネスとして人気のMomentum。`,
    },
    {
      title: "ハイトレ100マイラーへの第一歩",
      slug: "trail-running-first-step",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-12-15"),
      categoryId: climbing.id,
      tagSlugs: ["training"],
      body: `トレイルランへ踏み出した記録。`,
    },
    {
      title: "奥武蔵の秋クライミング合宿",
      slug: "okumusashi-autumn-camp",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-11-28"),
      categoryId: climbing.id,
      tagSlugs: ["crag", "training"],
      body: `奥武蔵でクライミング合宿を行ってきた。`,
    },
    {
      title: "ハングボードトレ50日チャレンジ",
      slug: "hangboard-50days",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-11-15"),
      categoryId: climbing.id,
      tagSlugs: ["training"],
      body: `ハングボードを50日間続けた記録。`,
    },
    {
      title: "アラフィフからのキャンパスボード入門",
      slug: "campus-board-intro",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-11-01"),
      categoryId: climbing.id,
      tagSlugs: ["training"],
      body: `キャンパスボードに踏み出した。`,
    },
    {
      title: "自宅トレで5級突破",
      slug: "home-training-5kyu",
      thumbnailUrl: null,
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-10-20"),
      categoryId: climbing.id,
      tagSlugs: ["training"],
      body: `自宅トレーニングだけで5級を突破した話。`,
    },
    {
      title: "（下書き）秋の城ヶ崎海岸レポート",
      slug: "jogasaki-autumn-draft",
      thumbnailUrl: null,
      status: "DRAFT" as const,
      publishedAt: null,
      categoryId: climbing.id,
      tagSlugs: ["crag"],
      body: `まだ書きかけです。`,
    },
  ];

  for (const a of articles) {
    const { tagSlugs, ...data } = a;
    const article = await prisma.article.create({ data });
    for (const slug of tagSlugs) {
      const tag = tags.find((t) => t.slug === slug)!;
      await prisma.articleTag.create({
        data: { articleId: article.id, tagId: tag.id },
      });
    }
  }

  await prisma.landingPage.createMany({
    data: [
      {
        slug: "test-lp",
        title: "テストLP",
        metaTitle: "テストLP | E2E",
        metaDescription: "e2eテスト用のLP",
        html: `<section class="hero">
  <h1>テストLPタイトル</h1>
  <p>このLPはe2eテスト用です。</p>
  <a href="https://example.com/signup" class="btn-primary">今すぐ登録する</a>
  <button type="button" class="btn-secondary">詳しく見る</button>
</section>`,
        css: ".hero { padding: 40px; }",
        status: "PUBLISHED",
      },
      {
        slug: "test-lp-draft",
        title: "下書きLP",
        html: "<h1>下書き</h1>",
        status: "DRAFT",
      },
    ],
  });

  console.log("E2E seed complete: 4 categories, 13 articles (1 draft), 5 tags, 2 LPs (1 draft)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
