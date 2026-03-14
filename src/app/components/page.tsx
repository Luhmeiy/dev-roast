import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { TableRow } from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const section = {
    title: "text-lg font-semibold mb-4 mt-8 text-zinc-900",
    description: "text-zinc-600 mb-4",
    grid: "flex flex-wrap gap-4",
};

export default function ComponentsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 p-8">
            <h1 className="text-2xl font-bold mb-2 text-zinc-900">
                UI Components
            </h1>
            <p className="text-zinc-600 mb-8">
                A showcase of all UI components and their variants.
            </p>

            <section>
                <h2 className={section.title}>Button</h2>
                <p className={section.description}>
                    A clickable button element with multiple variants and sizes.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Variants
                    </h3>
                    <div className={section.grid}>
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Sizes
                    </h3>
                    <div className={section.grid}>
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </div>
            </section>

            <section>
                <h2 className={section.title}>Toggle</h2>
                <p className={section.description}>
                    A switch component using Radix UI Switch.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Uncontrolled (default)
                    </h3>
                    <div className={section.grid}>
                        <Toggle>roast mode</Toggle>
                        <Toggle defaultChecked>roast mode</Toggle>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Controlled
                    </h3>
                    <p className="text-xs text-zinc-500 mb-2">
                        Requires client component wrapper
                    </p>
                </div>
            </section>

            <section>
                <h2 className={section.title}>Badge</h2>
                <p className={section.description}>
                    Status indicators with colored dots.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Variants
                    </h3>
                    <div className={section.grid}>
                        <Badge variant="critical">critical</Badge>
                        <Badge variant="warning">warning</Badge>
                        <Badge variant="good">good</Badge>
                        <Badge variant="verdict">needs_serious_help</Badge>
                    </div>
                </div>
            </section>

            <section>
                <h2 className={section.title}>Card</h2>
                <p className={section.description}>
                    Generic card component with header, title, and description.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Analysis Card
                    </h3>
                    <Card
                        status="critical"
                        label="critical"
                        cardTitle="using var instead of const/let"
                        cardDescription="the var keyword is function-scoped rather than block-scoped, which can lead to unexpected behavior and bugs. modern javascript uses const for immutable bindings and let for mutable ones."
                    />
                </div>
            </section>

            <section>
                <h2 className={section.title}>DiffLine</h2>
                <p className={section.description}>
                    Code diff lines showing removed, added, or context lines.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Variants
                    </h3>
                    <div className="flex flex-col gap-1 bg-zinc-900 p-2 rounded w-full max-w-[560px]">
                        <DiffLine variant="removed" prefixChar="-">
                            var total = 0;
                        </DiffLine>
                        <DiffLine variant="added" prefixChar="+">
                            const total = 0;
                        </DiffLine>
                        <DiffLine variant="context" prefixChar=" ">
                            for (let i = 0; i &lt; items.length; i++) {"{"}
                        </DiffLine>
                    </div>
                </div>
            </section>

            <section>
                <h2 className={section.title}>TableRow</h2>
                <p className={section.description}>
                    Reusable table row for leaderboards.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Leaderboard Row
                    </h3>
                    <div className="bg-zinc-900 rounded border border-zinc-800 w-full max-w-[560px]">
                        <TableRow
                            rank={1}
                            score={2.1}
                            scoreStatus="critical"
                            codePreview="function calculateTotal(items) { var total = 0; ..."
                            language="javascript"
                        />
                        <TableRow
                            rank={2}
                            score={5.8}
                            scoreStatus="warning"
                            codePreview="const calculateTotal = (items) => { ..."
                            language="javascript"
                        />
                        <TableRow
                            rank={3}
                            score={8.2}
                            scoreStatus="good"
                            codePreview="const calculateTotal = async (items) => { ..."
                            language="javascript"
                        />
                    </div>
                </div>
            </section>

            <section>
                <h2 className={section.title}>ScoreRing</h2>
                <p className={section.description}>
                    Circular score display with gradient arc.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Scores
                    </h3>
                    <div className="flex gap-8">
                        <ScoreRing score={3.5} />
                        <ScoreRing score={7.2} />
                        <ScoreRing score={9.8} />
                    </div>
                </div>
            </section>

            <section>
                <h2 className={section.title}>CodeBlock</h2>
                <p className={section.description}>
                    Server-rendered code block with syntax highlighting using
                    Shiki.
                </p>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-zinc-700">
                        Default
                    </h3>
                    <CodeBlock
                        code={`function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}`}
                        language="javascript"
                        filename="calculate.js"
                    />
                </div>
            </section>
        </div>
    );
}
