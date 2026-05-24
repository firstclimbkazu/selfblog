"use client";

import { useState, useTransition } from "react";
import CodeTabsPanel from "./CodeTabsPanel";
import SettingsPanel from "./SettingsPanel";
import ImagesPanel from "./ImagesPanel";
import type { LpImageDto } from "./types";

type Defaults = {
  title: string;
  slug: string;
  html: string;
  css: string;
  js: string;
  headHtml: string;
  metaTitle: string;
  metaDescription: string;
  metaOgImage: string;
  status: "DRAFT" | "PUBLISHED";
};

type Props = {
  lpId: string;
  action: (formData: FormData) => Promise<void>;
  defaults: Defaults;
  images: LpImageDto[];
};

export default function LpEditor({ lpId, action, defaults, images }: Props) {
  const [html, setHtml] = useState(defaults.html);
  const [css, setCss] = useState(defaults.css);
  const [js, setJs] = useState(defaults.js);
  const [headHtml, setHeadHtml] = useState(defaults.headHtml);

  const [title, setTitle] = useState(defaults.title);
  const [slug, setSlug] = useState(defaults.slug);
  const [status, setStatus] = useState(defaults.status);
  const [metaTitle, setMetaTitle] = useState(defaults.metaTitle);
  const [metaDescription, setMetaDescription] = useState(
    defaults.metaDescription
  );
  const [metaOgImage, setMetaOgImage] = useState(defaults.metaOgImage);

  const [rightTab, setRightTab] = useState<"settings" | "images">("settings");
  const [imageList, setImageList] = useState<LpImageDto[]>(images);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(fd);
      setSaveMessage("保存しました");
      setTimeout(() => setSaveMessage(null), 2000);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <input type="hidden" name="html" value={html} />
      <input type="hidden" name="css" value={css} />
      <input type="hidden" name="js" value={js} />
      <input type="hidden" name="headHtml" value={headHtml} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="metaTitle" value={metaTitle} />
      <input type="hidden" name="metaDescription" value={metaDescription} />
      <input type="hidden" name="metaOgImage" value={metaOgImage} />

      <div className="lg:col-span-7">
        <CodeTabsPanel
          html={html}
          setHtml={setHtml}
          css={css}
          setCss={setCss}
          js={js}
          setJs={setJs}
          headHtml={headHtml}
          setHeadHtml={setHeadHtml}
        />
      </div>

      <div className="lg:col-span-3 space-y-4">
        <div className="flex border-b border-[var(--sotw-border)]">
          <TabButton
            active={rightTab === "settings"}
            onClick={() => setRightTab("settings")}
          >
            設定
          </TabButton>
          <TabButton
            active={rightTab === "images"}
            onClick={() => setRightTab("images")}
          >
            画像
          </TabButton>
        </div>

        {rightTab === "settings" ? (
          <SettingsPanel
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            status={status}
            setStatus={setStatus}
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            metaOgImage={metaOgImage}
            setMetaOgImage={setMetaOgImage}
            previewSlug={defaults.slug}
            isPending={isPending}
            saveMessage={saveMessage}
          />
        ) : (
          <ImagesPanel
            lpId={lpId}
            images={imageList}
            setImages={setImageList}
          />
        )}
      </div>
    </form>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm border-b-2 -mb-px transition-colors ${
        active
          ? "border-[var(--sotw-moss)] text-[var(--sotw-moss)] font-medium"
          : "border-transparent text-[var(--sotw-text-2)] hover:text-[var(--sotw-text)]"
      }`}
    >
      {children}
    </button>
  );
}
