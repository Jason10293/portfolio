type Entry = {
  season: string;
  sport: string;
  team: string;
  status: "won" | "played" | "current";
};

const timeline: Entry[] = [
  { season: "Winter 2026", sport: "Volleyball - Mixed Int", team: "hits and giggles", status: "current" },
  { season: "Winter 2026", sport: "Futsal - Open Rec", team: "Watermelon", status: "current" },
  { season: "Winter 2026", sport: "Handball - Mixed Rec", team: "Ball Busters", status: "current" },
  { season: "Winter 2026", sport: "Multisport - Mixed Rec", team: "goblin gang", status: "current" },
  { season: "Fall 2025", sport: "Volleyball - Mixed Comp", team: "Sloppy Joes", status: "won" },
  { season: "Fall 2025", sport: "Ultimate Frisbee - Open Comp", team: "Schr\u00F6dinger's Cat", status: "won" },
  { season: "Winter 2025", sport: "Volleyball - Mixed Rec", team: "Joes", status: "won" },
  { season: "Winter 2025", sport: "Futsal - Open Rec", team: "UNCs and ANTs", status: "played" },
  { season: "Winter 2025", sport: "Volleyball - Mixed Comp", team: "Joes", status: "won" },
  { season: "Fall 2024", sport: "Volleyball - Mixed Comp", team: "Joes", status: "won" },
  { season: "Fall 2023", sport: "Volleyball - Open Comp", team: "No Hands", status: "played" },
];

const sportIcon: Record<string, string> = {
  Volleyball: "\u{1F3D0}",
  "Ultimate Frisbee": "\u{1F94F}",
  Futsal: "\u{26BD}",
  Handball: "\u{1F93E}",
  Multisport: "\u{1F3BD}",
};

const IntramuralsPage = () => {
  const primaryText = "text-neutral-900 dark:text-neutral-100";
  const secondaryText = "text-neutral-500 dark:text-neutral-400";
  const accentText = "text-neutral-400 dark:text-neutral-500";

  const wins = timeline.filter((e) => e.status === "won");

  // Group entries by season for the timeline
  const grouped: {
    season: string;
    entries: { sport: string; team: string; status: Entry["status"] }[];
  }[] = [];
  for (const entry of timeline) {
    const last = grouped[grouped.length - 1];
    if (last && last.season === entry.season) {
      last.entries.push({ sport: entry.sport, team: entry.team, status: entry.status });
    } else {
      grouped.push({
        season: entry.season,
        entries: [{ sport: entry.sport, team: entry.team, status: entry.status }],
      });
    }
  }

  return (
    <div className="animate-[fadeIn_0.5s_ease-in-out] space-y-12">
      <div className="mb-12">
        <h2 className={`text-4xl font-light mb-4 ${primaryText}`}>
          Intramurals
        </h2>
        <p>
          A collection of all the intramural teams that I've played on over the
          years.
        </p>
        <p className={secondaryText}>
          {wins.length} championship titles and counting.
        </p>
      </div>

      {/* Timeline */}
      <section className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-800" />

        <div className="space-y-10">
          {grouped.map(({ season, entries }, gi) => {
            const isCurrent = entries[0]?.status === "current";
            return (
              <div key={`${season}-${gi}`} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 z-10 ${
                    isCurrent
                      ? "border-green-400 dark:border-green-500 bg-green-400/20 dark:bg-green-500/20"
                      : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-950"
                  }`}
                />

                {/* Season label */}
                <div className="flex items-center gap-2 mb-3">
                  <p
                    className={`text-xs uppercase tracking-widest ${accentText}`}
                  >
                    {season}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium">
                      In Progress
                    </span>
                  )}
                </div>

                {/* Entries for this season */}
                <div className="space-y-2">
                  {entries.map(({ sport, team, status }, si) => (
                    <div
                      key={`${sport}-${si}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                        status === "won"
                          ? "border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50"
                          : status === "current"
                            ? "border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20"
                            : "border-dashed border-neutral-200 dark:border-neutral-800 bg-transparent"
                      }`}
                    >
                      <span className="text-lg" role="img" aria-label={sport}>
                        {sportIcon[sport.split(" - ")[0]] || "\u{1F3C6}"}
                      </span>
                      <div>
                        <p
                          className={`${status === "played" ? secondaryText : primaryText} font-medium text-sm`}
                        >
                          {team}
                        </p>
                        <p className={`${accentText} text-xs`}>
                          {sport}
                        </p>
                        <p className={`text-[10px] ${accentText}`}>
                          {status === "won"
                            ? "Champions"
                            : status === "current"
                              ? "Currently Playing"
                              : "Participated"}
                        </p>
                      </div>
                      {status === "won" && (
                        <span
                          className="ml-auto text-base"
                          role="img"
                          aria-label="trophy"
                        >
                          {"\u{1F3C6}"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default IntramuralsPage;
