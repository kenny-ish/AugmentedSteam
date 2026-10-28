import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import {JSDOM} from "jsdom";
import ts from "typescript";

const helperPath = new URL("../src/js/Content/Features/Community/GameCard/MarketHashName.ts", import.meta.url);
const source = await readFile(helperPath, "utf8");
const compiled = ts.transpileModule(source, {
    compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2021
    }
}).outputText;
const {getCardMarketHashName} = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("uses the canonical name from the market link", () => {
    const dom = new JSDOM(`
        <div class="badge_card_set_card">
            <a href="/market/listings/753/620-Destruction%20(Trading%20Card)"></a>
            <div class="badge_card_set_text">Zerstörung</div>
        </div>
    `);

    const card = dom.window.document.querySelector(".badge_card_set_card");
    assert.ok(card);
    assert.equal(getCardMarketHashName(card, 620, "Zerstörung"), "620-Destruction");
});

test("falls back to the visible name when no market link is present", () => {
    const dom = new JSDOM('<div class="badge_card_set_card"></div>');
    const card = dom.window.document.querySelector(".badge_card_set_card");

    assert.ok(card);
    assert.equal(getCardMarketHashName(card, 620, "Destruction"), "620-Destruction");
});
