import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { THEMES } from "@/src/themes";

// Selector del tema activo del sitio. El cambio se ve en la web en ~1 min (caché del CDN).
export default function ThemePicker() {
  const active = useQuery(api.settings.functions.getActiveTheme, {});
  const setActive = useMutation(api.settings.functions.setActiveTheme);
  const [saving, setSaving] = useState(false);

  return (
    <label className="flex items-center gap-2 font-mono text-xs text-zinc-500">
      tema
      <select
        value={active ?? ""}
        disabled={active === undefined || saving}
        onChange={async (e) => {
          setSaving(true);
          try {
            await setActive({ theme: e.target.value });
          } finally {
            setSaving(false);
          }
        }}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-200 disabled:opacity-50"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}
