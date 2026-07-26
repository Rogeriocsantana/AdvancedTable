import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const distDirectory = path.join(projectRoot, "dist");
const pbiviz = JSON.parse(
    await (await import("node:fs/promises")).readFile(
        path.join(projectRoot, "pbiviz.json"),
        "utf8"
    )
);
const version = pbiviz.visual?.version ?? pbiviz.version;
const targetName = `AdvancedTable.${version}.pbiviz`;
const targetPath = path.join(distDirectory, targetName);

const candidates = (await readdir(distDirectory, { withFileTypes: true }))
    .filter((entry) =>
        entry.isFile() &&
        entry.name.endsWith(".pbiviz") &&
        entry.name !== targetName
    )
    .map((entry) => entry.name)
    .filter((name) => name.includes(version));

if (candidates.length !== 1) {
    throw new Error(
        `Esperado um pacote .pbiviz da versão ${version} em dist, encontrados: ${candidates.join(", ") || "nenhum"}.`
    );
}

await rm(targetPath, { force: true });
await rename(path.join(distDirectory, candidates[0]), targetPath);
console.log(`Pacote final: dist/${targetName}`);
