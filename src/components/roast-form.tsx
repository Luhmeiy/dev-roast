"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

export function RoastForm() {
    const [code, setCode] = useState("");
    const MAX_CHARS = 2000;
    const isOverLimit = code.length > MAX_CHARS;

    return (
        <>
            <section className="flex w-[780px] max-w-full flex-col">
                <CodeEditor
                    value={code}
                    onChange={setCode}
                    maxChars={MAX_CHARS}
                />
            </section>

            <section className="flex w-[780px] max-w-full items-center justify-between">
                <div className="flex items-center gap-4">
                    <Toggle defaultChecked>roast mode</Toggle>
                    <span className="text-xs text-zinc-500">
                        {"// maximum sarcasm enabled"}
                    </span>
                </div>
                <Button variant="primary" size="default" disabled={isOverLimit}>
                    $ roast_my_code
                </Button>
            </section>
        </>
    );
}
