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

  console.log("E2E seed complete: 4 categories, 5 articles (1 draft), 5 tags");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
