# JobWert — Product & Brand Identity (LOCKED)

State: 2026-09-10
Status: Approved / locked

## Product position

JobWert is not a job board, employer dashboard, or generic gross-to-net calculator. It is a job-decision tool for people in Germany asking one question:

> Is this new job really better for me after salary, taxes, living costs, commuting and time?

The core differentiator is **job decision economics**: salary + living costs + commute cost/time + effective hourly value + break-even/minimum salary.

## UX principle

The first experience must feel like “two clicks to an answer”, not a finance questionnaire.

Quick comparison asks only information users can reasonably know:
- current gross salary
- offered gross salary
- monthly/yearly salary period
- current city
- new work city
- office days per week
- main transport mode
- tax class
- Wohnsituation: Allein / Paar / Familie
- whether the user will move for the new job

The quick flow must NOT ask for dozens of values such as future rent, fuel, deposit, insurance, exact kilometre cost, church tax, child count, or health-insurance add-on rate.

Unknown values are estimated by JobWert and must be visibly marked as **geschätzt**. Users can replace them later under **Details anpassen**.

## Result hierarchy

The result must answer the decision before showing detail.

Primary result:
- likely advantage / likely disadvantage / too close to call
- realistic monthly advantage range
- midpoint as orientation, not false precision

Supporting metrics:
- estimated net salary
- housing-cost impact
- living-cost impact
- commute cost
- commute time
- effective hourly value
- minimum salary for a real advantage

Use uncertainty honestly. Do not present estimated rent/commute values as exact facts.

## Visual identity — LOCKED

Approved direction:
- white / very light background
- dark navy typography
- vivid JobWert blue for brand and primary CTA
- pale blue information areas
- green only for positive outcomes
- red only for negative differences/cost impact
- rounded cards and controls
- thin borders
- subtle shadows
- generous whitespace
- clean sans-serif typography
- simple line-style iconography
- professional German fintech / SaaS feeling

The calculator must never look like an HR administration system or job-posting dashboard.

Desktop quick comparison should read immediately as A/B comparison:
- current situation
- new job offer
- a small guidance/benefits panel

The result page should use:
- side-by-side current/new job summary
- comparison rows
- clearly highlighted real advantage
- conclusion/insight panel on the right
- optional details and secondary actions below the main conclusion

Human stock photography is not part of the core calculator/results experience. Subtle city context may be used, but must never overpower the decision UI.

## Brand protection rule

Do not redesign the global visual system, colors, typography scale, calculator layout, or result hierarchy without explicit approval. New features must inherit this system.

## Language

Primary market and primary UI language: German / Germany.
English and Turkish may remain supported for the core calculator, but German is the source language for product decisions.

## Development rule

Prefer a safe, simple, testable solution over overengineering. New features should support user value, conversion, retention, validation, or monetization. Avoid paid dependencies unless explicitly approved.
