import { forwardRef, type HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const container = tv({
    base: "relative inline-flex items-center justify-center",
});

const scoreText = tv({
    base: "flex items-baseline gap-0.5 font-mono font-bold text-zinc-50",
});

const denominator = tv({
    base: "font-mono text-zinc-500 text-[16px]",
});

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
    score: number;
    maxScore?: number;
    size?: number;
}

export const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
    ({ className, score, maxScore = 10, size = 180, ...props }, ref) => {
        const percentage = (score / maxScore) * 100;
        const radius = (size - 16) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset =
            circumference - (percentage / 100) * circumference;

        return (
            <div
                className={container({ className })}
                style={{ width: size, height: size }}
                ref={ref}
                {...props}
            >
                <svg
                    className="absolute inset-0 -rotate-90"
                    width={size}
                    height={size}
                    aria-label={`Score: ${score} out of ${maxScore}`}
                    suppressHydrationWarning
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#27272a"
                        strokeWidth={8}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth={8}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-500"
                    />
                    <defs>
                        <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="35%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#EF4444" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className={scoreText()}>
                    <span style={{ fontSize: `${size * 0.267}px` }}>
                        {score}
                    </span>
                    <span className={denominator()}>/{maxScore}</span>
                </div>
            </div>
        );
    },
);

ScoreRing.displayName = "ScoreRing";
