# Crust & Crumb Bread Glossary
## Consolidated findings and implementation work order for Astra

**Owner:** Henry Hunter  
**Prepared:** October 1, 2026  
**Updated:** October 2, 2026, with confirmed operational findings and remaining actions.  
**Assignment:** Combine the useful recommendations from both work orders, verify the current implementation, and improve the glossary without rebuilding working features.  
**Build supplied for review:** https://crust-and-crumb-km00v74ia-henryhunterjrs-projects.vercel.app/

## 1. What the two reports reveal

The reports agree on the main direction: make this a bread reference that helps people bake, with practical definitions, connected topics, strong fresh-milled flour coverage, and reliable technical content.

Perplexity's order is stronger on content inventory, grain and flour science, international vocabulary, editorial accountability, and measurable handoff documents. The earlier ChatGPT order is stronger on explicit search behavior, A–Z navigation, visual teaching, connections to Henry's resources, sitemap requirements, and performance. These strengths belong in one plan.

| Area | Earlier ChatGPT work order | Perplexity work order | Consolidated instruction |
|---|---|---|---|
| Inventory and cleanup | Limited audit instructions | Detailed entry inventory, scoring, aliases, and merge decisions | Audit the actual dataset before expansion |
| Content depth | Practical definition, dough cues, tips, mistakes | Structured flagship template and technical nuance | Use concise cards and fuller term pages; depth follows the term's usefulness |
| Fresh milling and grains | Priority additions | Extensive coverage matrix and scientific distinctions | Make this a primary strength; source technical claims |
| International bread vocabulary | Broad category | Specific traditions, terminology, and cultural review | Preserve origin and context; distinguish adaptations |
| Search and browsing | Explicit search fields, alphabet, and topic filters | Search validation plus category/level metadata | Combine behavior requirements with the metadata model |
| Learning paths | Related lessons and ecosystem links | Ten sequenced learning paths | Improve existing paths and add missing paths |
| Visual learning | Specific photo/video teaching priorities | Little implementation detail | Add useful, accurate demonstrations with captions and rights tracking |
| Editorial trust | Review date and structured fields | Standards, methodology, sources, and changelog | Publish a truthful editorial process and claim-level sources |
| Discoverability | Sitemap, term URLs, metadata, canonicals | Breadcrumbs, broader schema, author information | Add rendered content checks, stable domain handling, and correct status codes |
| Mobile and accessibility | 390 px, keyboard, contrast, tap targets | 320/375 px, screen-reader announcements and modal behavior | Test all three widths plus desktop with manual and automated checks |
| Completion measurement | Functional checklist | Inventory outputs and numerical scorecard | Require evidence, clear denominators, and release gates |
| Competitive ranking | Approximate #10 market / #8 product positions | Top-3/#1 ambition | Rebenchmark using a disclosed rubric; do not carry estimates forward as facts |

### Corrections to apply before implementation

1. **Verify the canonical baseline.** A live HTML spot check confirms 279 listed term URLs and six displayed paths. The complete dataset still needs a duplicate/alias and publication-status audit. The earlier target of 100+ terms is already exceeded.
2. **Treat 350+ as a planning target.** It is a possible expansion milestone, not proof of quality or a mandatory first-release gate. Do not create filler or duplicate entries to reach it.
3. **Improve existing features.** Search controls, six paths, category/level filters, A–Z controls, individual term pages, exports, troubleshooting entry points, and an Ask Krusty control are already present. Test their behavior and repair or extend them.
4. **Resolve the entry-quality contradiction.** Perplexity requires every major entry to meet its full standard, then allows lower completion percentages in its scorecard. For each release batch, every major entry in that batch must meet the applicable standard. The entire back catalog can improve in stages.
5. **Do not present earlier rankings as established findings.** Neither supplied work order includes the scored evidence necessary to reproduce an exact market or product ranking. The rankings remain provisional.
6. **Do not publish questionable candidate terminology automatically.** “Bagger’s formula” appears in Perplexity's list. Verify its intended meaning and a credible reference; do not invent a definition. Check vague candidates such as “bran sharpness” and “whole berry” for whether they merit an entry or belong in another explanation.
7. **Do not inflate distinct concepts or flatten them into aliases.** Synonyms can share one entry. Related concepts such as underfermentation and underproofing need their differences explained before any merge decision.
8. **Move discoverability into the foundation phase.** Useful content should not wait until the final phase to get usable, crawlable URLs.

**Evidence boundary:** This document compares the two supplied work orders and incorporates a limited live HTTP/HTML inspection of the supplied deployment. It is not a fresh competitive ranking, a complete content audit, or an interactive browser/accessibility test. Astra must inspect the source dataset and test the actual controls before marking them passed.

### What the live deployment already shows

Inspection covered the homepage, `/term/bulk-fermentation`, `/term/fresh-milled-flour`, `/sitemap.xml`, `/robots.txt`, and an attempted `/editorial-standards` request.

| Observed evidence | Implication for Astra |
|---|---|
| Homepage has 279 term links and 279 distinct term URLs in its DefinedTermSet | Begin with the existing inventory; unique meanings and aliases still need review |
| Six displayed paths: Beginner Basics, Sourdough Mastery, Bread Types, Fresh-Milled & Ancient Grains, Troubleshooting, Tools & Equipment | Extend/map these; do not build ten duplicate paths |
| Search input, category/level controls, A–Z, quick view, JSON/CSV/Markdown downloads, symptom entry points, and Ask Krusty controls appear in HTML | Audit behavior and accessibility; the controls' presence is not a functional pass |
| Sample `/term/` pages return 200, unique titles, term-specific canonicals, actual definition text, connected terms, and practical notes in initial HTML | Preserve `/term/[slug]`; server-rendered content and deep-link infrastructure already exist |
| Homepage and sample pages reference `https://crust-and-crumb-tawny.vercel.app` as canonical identity; sitemap and robots use that domain too | Confirm that this is the intended, live permanent domain. This alignment is not itself a demonstrated defect |
| Sitemap and robots endpoints return 200 | Validate their contents and publication rules rather than creating replacements from scratch |
| `/editorial-standards` returns 404 | Add this page or locate an existing equivalent; other editorial-support routes were not checked |
| Homepage HTML response is 1,620,814 bytes, approximately 1.62 MB uncompressed | Profile page/hydration payload and media. This is a payload observation, not a measured Core Web Vitals failure |
| Bulk Fermentation shows a long Go deeper list with a repeated article title and some broadly related resources | Deduplicate and curate one primary next resource; offer an optional secondary library without overwhelming lookup |
| Fresh-Milled Flour includes a broad comparison implying bagged flour has lost flavor and nutrition, with source labels rather than claim-specific support | Review and replace unsubstantiated comparative claims; distinguish freshness, whole-grain content, processing, and storage |

The live sample changes the assignment from feature construction to quality improvement, targeted content expansion, resource curation, and verification. Many candidate terms in the reports are already present, including Aleurone Layer, Aged Flour, Ash Content, and Bolting. The coverage appendix must therefore be checked against the current library rather than used as an automatic add list.

## 2. Assignment and first deliverable

Build toward this standard: **a practical, trustworthy bread glossary that helps a home baker understand what to do next.**

Start with an inventory and implementation baseline. Then complete the prioritized work below. Use the existing stack and design system unless a documented limitation prevents the required behavior.

Before changing content or routes:

- Export the current terms and relevant configuration. Keep a recoverable snapshot.
- Record the repository/build identifier, deployment URL, access state, and audit date.
- Identify the permanent public domain from project configuration. Do not invent it or adopt a temporary preview hostname as the permanent identity.
- List what already works, what is partly implemented, what is absent, and what cannot yet be verified.
- Capture representative desktop/mobile pages, search behavior, HTML responses, metadata, and link health.
- Establish a migration and rollback path for data-model and URL changes.

For every term, inventory: stable ID, current URL/slug, canonical name, full existing content, aliases, primary category, secondary tags, difficulty, major/supporting designation, related terms, linked resources, source needs, review date, quality score, accuracy risk, duplicate risk, proposed action, and reasons.

Separate these counts: total records, published canonical entries, drafts, aliases, archived records, and suspected duplicates. An alias is not another unique term.

Use this entry-quality scale:

| Score | Meaning |
|---|---|
| 1 | Incorrect, unsupported, incomplete, or unusable |
| 2 | Thin, unclear, repetitive, or potentially misleading |
| 3 | Accurate basic definition with limited application |
| 4 | Strong practical entry with a specific remaining gap |
| 5 | Accurate, readable, useful, appropriately sourced, and well connected |

Score accuracy, clarity, practical value, appropriate depth, and connections separately before assigning an overall score. Required metadata alone does not make an entry excellent.

## 3. Content structure and Henry's voice

Maintain a simple reading experience. The definition comes first. A search card should show the term, a short definition, category/level where helpful, and an obvious link to more detail.

### Major-entry standard

Major entries are core baking concepts, important diagnostics, key milling/grain topics, and technical concepts that materially change decisions. Mark them explicitly in the inventory.

Each major term needs:

1. **Definition:** direct, plain language. Usually one to three sentences; expand only when the distinction requires it.
2. **Why it matters:** the effect on dough, process, flavor, texture, equipment choice, or workflow.
3. **In practice:** a realistic example with weights, percentages, temperature, or sensory cues where useful.
4. **What you'll see or feel:** for techniques, fermentation stages, and diagnostics.
5. **Common mistake or misconception:** one useful correction rather than generic caution.
6. **Nuance:** regional, scientific, recipe, or production variation when applicable.
7. **Related terms:** normally four to eight relevant links.
8. **One next resource:** a verified Henry resource when it teaches the next step.
9. **Sources and review information:** actual references for technical/cultural claims and a truthful review date.

Supporting terms can be shorter. They still need a useful definition, categorization, and meaningful connections. Normally provide at least three related links, with a documented exception when fewer are genuinely relevant. Do not fill link slots with unrelated terms.

Use contractions, short paragraphs, specific examples, and Henry's practical teaching voice. No em dashes, corporate language, empty praise, or unexplained jargon. Include pronunciation only when useful and verified. Preserve technical qualifications when behavior depends on the flour, temperature, method, or culture. Do not turn every term into an article or force every entry to the same word count.

### Starter batch to upgrade first

Audit and improve these before expanding obscure vocabulary: bulk fermentation, proofing, hydration, baker's percentage, starter, levain, autolyse, fermentolyse, gluten development, dough strength, extensibility, elasticity, windowpane, stretch and fold, coil fold, shaping, scoring, oven spring, underproofing, overproofing, gummy crumb, fresh-milled flour, extraction rate, einkorn, spelt, rye, scald, tangzhong, and yudane.

For diagnostics, explain observable signs, plausible causes, evidence that separates the causes, and one sensible adjustment. Do not assign a universal cause from a crumb photograph or an isolated symptom. Do not tell bakers to change hydration, fermentation, and baking time all at once.

## 4. Taxonomy and coverage

Use one primary category per canonical entry, with secondary categories/tags where useful. Preserve existing category identities through a mapping if labels change.

| Category | Teaching purpose |
|---|---|
| Bread Fundamentals | Basic structure and process |
| Sourdough and Fermentation | Cultures, activity, acidity, and timing |
| Dough Mixing and Development | Strength, handling, and mixing methods |
| Shaping, Proofing, and Baking | Final structure, readiness, and oven behavior |
| Baker's Math and Formula Design | Percentages, scaling, yield, and preferment accounting |
| Flour Science | Strength, absorption, enzymes, and milling measurements |
| Fresh-Milled Flour and Home Milling | Practical milling and fresh-flour handling |
| Grain Anatomy and Milling | Kernel components, processing, and extraction |
| Ancient, Heritage, and Specialty Wheats | Identity, terminology, and dough behavior |
| Rye and Alternative Grains | Distinct structures and uses |
| Preferments and Leavening | Yeast types, starter builds, and dough systems |
| Bread Styles and Global Traditions | Bread vocabulary in its cultural context |
| Tools and Equipment | Purpose, limitations, substitutes, and technique |
| Ingredients and Additions | Salt, fats, sweeteners, enrichments, and inclusions |
| Troubleshooting and Bread Defects | Observation, causes, and corrective choices |
| Commercial and Advanced Baking Concepts | Optional depth for experienced bakers |
| Food Safety and Storage | Handling, cooling, storage, and spoilage |
| Terms, Culture, and History | Origins, regional variation, and terminology |

The appendix preserves the candidate coverage lists from Perplexity and adds topics from the earlier report. These are audit candidates, not confirmed omissions. Mark each as covered, needs improvement, missing, alias, contextual subsection, or unsuitable.

### Required accuracy distinctions

Research and explain the following distinctions wherever applicable:

- Protein percentage, gluten quality, flour strength, and kernel hardness.
- Ash content and extraction rate; flour grading systems differ by region.
- Formula hydration and perceived wetness. State what flour and water are counted, including preferments, soakers, and scalds. Explain the limits of simple hydration calculations with enriched dough.
- Diastatic and non-diastatic malt; damaged starch and enzyme activity.
- Autolyse and fermentolyse; starter and levain; feeding ratio and inoculation. State the denominator used for each percentage.
- Peak, ripeness, and starter maturity; pH and titratable acidity; lactic and acetic acidity. Avoid rigid promises about flavor from one variable.
- Bulk fermentation and final proof; cold retard and cold proof in their stated context; underfermentation and underproofing.
- Scald, soaker, cooked flour, tangzhong, yudane, Brühstück, Quellstück, and Kochstück. Do not treat all hot-water methods as identical.
- Rye structure, pentosans, acidity, and enzyme-related crumb problems, with technical references.
- Ancient, heritage, heirloom, and landrace descriptions; scientific species, market names, and trademarks.
- Farro's variable commercial/regional usage; generic khorasan wheat and KAMUT® branding.
- Gluten-containing grains, gluten-free ingredients, cross-contact, and the limits of direct substitutions.
- Sourdough microorganisms and their roles, with no oversimplified claim that either yeast or bacteria acts alone.
- Traditional bread/process definitions and modern adaptations.

No universal claims that fresh flour needs more water, ferments faster, or produces denser bread. No unsupported digestion, blood-sugar, nutrition, allergy, or celiac-safety claims. Do not publish health claims by adding a disclaimer to an unsupported assertion. Check technical claims against appropriate primary sources and cultural terminology against sources with relevant expertise.

## 5. Search, browsing, and navigation

Retain existing useful behavior. Improve gaps with these requirements:

- Search canonical names, aliases, short/full definitions, keywords, and categories. Rank exact names and exact aliases above weaker body-text matches.
- Normalize case, diacritics, apostrophes, and hyphens while preserving the displayed spelling. “batard” should find “bâtard”; “bakers percentage” should find “baker's percentage.”
- Use modest typo tolerance if practical. Do not return unrelated results merely to avoid an empty state.
- Display a result count, meaningful empty state, and a clear way to reset search/filters.
- Provide A–Z navigation; disable letters with no matching entries. Explain whether a letter filters results or jumps to a group, and keep that behavior consistent.
- Support categories and Beginner / Intermediate / Advanced filtering without making advanced material a prerequisite.
- Define combined filtering: OR within a selected group, AND across groups. Search, category, level, and alphabet controls must work together predictably.
- Preserve search/filter state when opening a term and returning. Use shareable query state where practical.
- Keep internal search/result combinations out of the sitemap. Do not create unlimited indexable filter permutations.
- Use normal links for term navigation, with working deep links, refresh, browser back, and forward. Existing homepage related-term controls appear as buttons; check whether these filter results or open terms, and provide crawlable destination links where navigation is intended.
- Announce updated result counts accessibly without moving focus on every keystroke.

Acceptance examples: exact term, alias, punctuation variant, accent-free spelling, definition keyword, combined filters, no results, reset, first/last alphabet group, and return from a term page.

## 6. Related terms, learning paths, and Henry's resources

Related terms should explain the next useful concept. Use stable term IDs for relationships where practical; resolve URLs at rendering time so slug changes do not break the knowledge map.

Audit the ten proposed paths: Start Baking Bread; Understand Sourdough; Learn Baker's Math; Fresh-Milled Flour 101; Ancient and Heritage Grains; Understand Rye Bread; Fix Common Bread Problems; Shape and Score Better Loaves; Choose Flour for Bread; Explore Global Bread Traditions.

Each path needs a plain-language purpose, a logical beginner-to-deeper sequence of approximately six to fifteen terms, and a practical learning outcome. Preserve existing paths and improve them rather than duplicating them. Publish missing paths in phases, with ten as the roadmap target.

Connect major entries to one relevant next resource. Prefer Henry's direct recipe, demonstration, or tool when it matches the term. Otherwise use the matching Bread Authority topic. Verify that the destination works and contains the intended topic; a successful HTTP response containing a generic app shell is insufficient.

Append `utm_campaign=bread-authority` to Bread Authority links, using `&` when other parameters already exist. Preserve existing query parameters. Do not guess missing slugs. If no working resource fits, omit the link and record the gap.

Resource candidates include Bread Authority, Recipe Pantry, Henry's videos/blog, Fermentation Compass, appropriate calculators, and Academy lessons. Label membership-only resources clearly. Definitions remain readable without a login. Keep invitations and affiliate material secondary to learning. Audit the existing Go deeper collections for repeated links, relevance, and primary-resource selection; the Bulk Fermentation sample already shows why this curation matters.

## 7. Visual teaching

Start with useful demonstrations: windowpane; stretch and fold; coil fold; shaping tension; scoring angle; bulk-fermentation progression; open/tight crumb; contextual examples of under/proper/overproofing; wheat berry anatomy; milling and sifting; and distinctions between scalds and soakers.

Use Henry's relevant real photography and demonstrations first. Record permission, attribution, captions, and alt text. Compare examples from sufficiently similar formulas or explain the differences. Do not present one photograph as a definitive diagnosis.

For exact scientific diagrams, use reviewed diagrams with accurate labels. For product photographs, use the client's exact supplied image. Do not invent equipment details or treat generated imagery as evidence of a real baking test. If instructional images include Henry's hands, represent a Black man's medium-brown hands accurately.

Compress responsive images, reserve their dimensions, and load video players on demand. Include captions/transcripts for demonstrations. No autoplay or decorative animation that slows lookup. A small initial visual set is preferable to delaying useful content for a large media collection.

## 8. Content model, publishing, and maintenance

Extend the existing model with these groups. Avoid a full rewrite when an incremental migration works.

| Group | Required fields or behavior |
|---|---|
| Identity | Stable ID, canonical name, slug, alias list, legacy route mapping |
| Definition | Short definition, explanation, why it matters, practical example, sensory cues, common mistake, optional nuance |
| Classification | Primary/secondary categories, tags, level, major/supporting status |
| Connections | Related term IDs, resource label/URL/access type, learning-path membership |
| Media | URL, caption, alt text, dimensions, rights/credit, transcript when applicable |
| Evidence | Source title, author/publisher, URL or book/page reference, supported claim/section, access date when relevant |
| Editorial | Actual author/reviewer, published/updated/reviewed dates, next review date, draft/review/published/archived status |
| Internal audit | Quality dimensions, accuracy risk, action notes, review blockers; never expose these publicly by default |
| Page metadata | Unique title/description, canonical identity, social preview data |

Validate unique slugs/IDs, required fields, valid relationships, supported statuses, and date formats. Reject dangling references. Preserve legacy IDs and content through migration. Separate internal notes and unpublished material from public data responses.

Use draft/review states for entries with unresolved factual questions. Henry reviews practical baking examples and voice; scientific or cultural questions need relevant evidence, not assumed expert endorsement. Publish resolved entries without making every routine edit depend on an additional approval loop.

Publish truthful supporting pages: `/editorial-standards`, `/methodology`, `/sources`, and `/updates` or `/changelog`. Adapt routes if equivalents already exist. Explain authorship, source selection, regional variation, AI assistance where applicable, update practices, and how corrections are handled. List only sources actually used. Never invent testing, peer review, endorsements, or a review date.

Add a usable “Report a correction” mechanism tied to the term. It should feed a review queue or documented contact route. Review technical/high-risk entries at least annually and sooner when credible corrections arrive. Use privacy-conscious aggregate search gaps to choose future content; do not log personal information or questions unnecessarily.

## 9. Discoverability and technical delivery

### Routes and content

Every published canonical entry needs a permanent route. The current implementation already uses `/term/[slug]`; preserve it. `/glossary/[slug]` in the earlier reports was an example, not a requirement to migrate working URLs. Alias/retired synonym routes should permanently redirect to the proper entry when equivalents exist. Unknown routes should return an appropriate not-found response. Do not redirect every missing term to the homepage.

Preserve the definition, heading, key explanation, and links in the initial HTML. The sampled current pages already deliver readable text this way. Verify broader coverage and avoid regressions rather than rebuilding rendering. This is a project requirement for broad crawler access; it does not mean Google is incapable of rendering JavaScript.

For each entry: unique title and meta description, one clear H1, self-referencing canonical, breadcrumbs, ordinary HTML links, aligned Open Graph metadata, and truthful attribution/dates. Canonicals, sitemap URLs, redirects, internal links, and structured-data IDs must agree on the permanent domain.

Publish a sitemap containing only canonical published pages. Verify robots rules and headers on the production site. Keep protected previews and drafts out of indexing without carrying preview `noindex` rules into production. Do not require search, scrolling, a modal, or authentication to reveal the only copy of a public definition.

### Structured data and AI-readable content

Use `DefinedTermSet` for the glossary and `DefinedTerm` for entries. Link the term to its set using `inDefinedTermSet`. Put the term name in `name`, its actual definition in `description`, aliases in `alternateName`, and canonical identity in `url`/`@id`. A `WebPage` can reference the term as its main entity. Add valid breadcrumbs where appropriate.

Use author/date properties on compatible page or creative-work entities, not arbitrary properties attached to every schema type. Person/Organization identity must match visible, verified information. Validate against Schema.org and test applicable Google-supported markup separately. Valid `DefinedTerm` markup does not by itself establish eligibility for a dedicated glossary rich result, a ranking improvement, or AI citations.

Use clear headings and predictable content fields to make definitions understandable to readers and machines. Do not prioritize speculative AI files or extra schemas ahead of accessible content and reliable URLs. An Ask Krusty control already exists: audit its behavior, source grounding, and term context before proposing a new chat feature. Do not assume the visible control proves a working or reliable assistant.

## 10. Accessibility, mobile, and performance

Target WCAG 2.2 AA for implemented interfaces. Combine automated checks with keyboard and screen-reader spot checks; an automated score is not certification.

Verify labels, heading hierarchy, visible/unobscured focus, sufficient contrast, non-color status cues, descriptive links, semantic controls, and accessible result announcements. Modals/accordions need correct focus and keyboard behavior. Support reduced motion and zoom/reflow.

Test 320, 375, and 390 px widths plus desktop. Search should be easy to reach; alphabet and filters must not overflow; text and linked terms must remain readable/tappable; no horizontal page scrolling. Aim for 44 px touch controls where practical while meeting applicable WCAG target-size requirements and exceptions.

Set initial goals of LCP ≤2.5 seconds, INP ≤200 milliseconds, and CLS ≤0.1 at the 75th percentile when real-user data is available. For a new site, record lab measurements and representative-device behavior separately; do not label lab scores as field results. Report device, network conditions, tool, date, and sample pages. Compress media, reserve layout space, avoid loading every video embed, and avoid unnecessary client code. Investigate the observed 1.62 MB homepage HTML: check repeated term data/markup, client hydration payload, and whether concise previews can reduce initial output while individual pages retain complete readable content. Measure changes before claiming an improvement.

## 11. Execution order and release gates

| Phase | Work | Evidence required to finish |
|---|---|---|
| 1. Baseline and foundations | Inventory, snapshot, duplicates, model migration, permanent domain, routes, source HTML, critical link/canonical fixes | Verified counts, audit table, route map, recoverable migration, feature baseline |
| 2. Core baker experience | Starter batch, related terms, search/aliases, A–Z, filters, readable mobile pages, initial editorial standards | Representative term pages meet content standard; search/navigation checks pass |
| 3. Fresh milling and grains | Milling/anatomy, flour science, ancient/heritage wheat, rye, two milling/grain learning paths | Reviewed coverage matrix, sourced technical distinctions, working paths |
| 4. Wider teaching depth | Math, preferments, diagnostics, remaining paths, global traditions, enriched/seasonal breads, food safety/storage | Category gaps addressed; sources and cultural context checked |
| 5. Visuals and expansion | Priority demonstrations, relevant integrations, high-value additions toward the 350+ planning target | Media accuracy/rights recorded; additions solve documented gaps |
| 6. Verification and benchmark | Full link/data checks, manual accessibility/mobile review, performance evidence, comparable competitor scoring | Completion scorecard, honest limitations, final handoff and remaining backlog |

Accessibility, performance, and indexing checks apply during every phase. Fix critical defects when discovered. Publish useful batches; do not wait for every roadmap item before releasing improvements.

For a 90-day roadmap, propose days 1–14 for the baseline/core foundation, 15–30 for core entries/search, 31–60 for milling/grains/science, and 61–90 for wider coverage/visuals/benchmark. These are planning windows, not a commitment. Adjust to the verified workload and report dependencies.

### Release acceptance

- All existing content is accounted for; merges preserve meaning and valid URLs.
- Every major entry changed in the release meets its applicable content standard.
- No unresolved serious factual issue is published in newly changed content.
- Required scientific/cultural claims have actual supporting references.
- Published records validate; internal links and alias mappings resolve.
- Search examples and combined filters work; keyboard navigation works.
- New/changed public term routes load directly and on refresh with correct content and metadata.
- Production pages are technically indexable; drafts/previews are handled correctly. Actual search-engine indexing is tracked separately.
- Structured data matches visible content and validates for the types used.
- Mobile, focus, contrast, and screen-reader checks show no unresolved blocking defects in changed flows.
- No new console errors or material performance regressions in checked flows.
- Unchecked items are marked unverified rather than passed.

## 12. Two competitive assessments with evidence

Do not copy the previous estimated positions into the final report. Use one documented comparison set of ten relevant resources. Candidate publishers from the reports include King Arthur Baking, The Fresh Loaf, Challenger Breadware, Home Baking Association, Baker's Almanac, The Spruce Eats, and specialist milling/grain references. Verify the actual resource URLs, scope, and accessibility. Fill remaining positions based on relevance, not invented competitors. Broad baking glossaries and specialist bread references need clearly labeled scope differences.

### A. Product-only comparison: if all resources launched today

Apply the same rubric, term sample, and user tasks to every resource. Ignore brand recognition, age, backlinks, and existing traffic.

| Dimension | Weight |
|---|---:|
| Accuracy, nuance, and substantiated claims | 25 |
| Practical value for home bakers | 20 |
| Bread-relevant coverage and useful depth | 15 |
| Findability and ease of use | 15 |
| Connected learning and useful visuals | 10 |
| Accessibility, mobile use, and technical delivery | 10 |
| Editorial transparency and maintenance | 5 |
| **Total** | **100** |

Score each dimension 0–5, then weight it. Use a fixed core sample plus a fresh-milling/grain sample; disclose the selection and whether this emphasis favors specialist resources. Include lookup tasks involving aliases, practical fermentation guidance, math, a troubleshooting distinction, grain behavior, and an international term. A resource lacking a sampled entry receives a coverage penalty; do not label its unseen definition inaccurate.

Record date, exact URLs, sample size, observations, evidence, and limitations. Inaccessible resources are unverified, not zero-quality. Report score ties and sensitivity to weights. A score is an editorial assessment, not an official industry ranking.

### B. Current-market assessment

Keep product quality separate from discoverability. Add observed coverage in search results for a documented set of queries, known brand presence, accessible authority/link evidence where available, and production indexability. Use the same search conditions and disclose location/date and limits.

Do not infer traffic, backlinks, adoption, or indexed-page counts from reputation or a `site:` search alone. If the evidence cannot support a numerical market ranking, deliver a market-readiness assessment and state that an exact rank is undetermined. A younger site can still compete on usefulness; age does not determine a product-quality score.

Report both assessments with their own rationale. A strong product score and modest visibility are different findings. Do not publish “#1” or “top three” as a fact unless the actual benchmark supports a precisely scoped claim.

## 13. Completion scorecard and handoff

Use verified baseline values. Identify denominators, sample sizes, and primary-category versus cross-tag counts.

| Measure | Baseline | Target / completion rule |
|---|---|---|
| Canonical published entries | 279 listed URLs observed; unique concepts/statuses still need audit | Documented useful growth; 350+ is a roadmap target |
| Existing records inventoried | Verify | 100% |
| Changed major entries meeting standard | Verify | 100% of release batch |
| Source-supported changed high-risk entries | Verify | 100% |
| Entry quality | Score actual inventory/sample | Aim ≥4.3/5; disclose how calculated and coverage |
| Published entries with relevant related links | Verify | 100%, with documented relevance exceptions |
| Duplicate/alias issues | Verify | Zero unresolved duplicates in changed scope; backlog disclosed |
| Candidate-topic matrix | Not yet verified | Every candidate assessed and assigned an action |
| Learning paths | Six displayed; functional quality still needs testing | Ten useful paths as roadmap target; track published count |
| Working next resources | Verify | All displayed destinations checked for correct content |
| New/changed canonical term routes | Verify | 100% pass content/metadata/response checks |
| Sitemap and structured data | Verify | Match published canonical content; applicable validation passes |
| Critical accessibility/mobile defects | Verify | Zero unresolved in changed flows; review scope disclosed |
| Performance | Measure | Meet stated goals where measurable; document exceptions |
| Competitive benchmark | Previous estimates only | Evidence-backed product assessment; market rank only if supportable |

Perplexity's proposed coverage milestones are useful planning indicators: approximately 30+ each for fresh milling, flour science, ancient/heritage wheats, and rye/alternative grains; 35+ global-tradition terms; 25+ troubleshooting terms. Reconcile them with the real inventory and candidate matrix. Do not count one entry twice in the total or force each category to a quota.

Deliver: inventory CSV/table; gap analysis; baseline screenshots/evidence; updated/new term records; category and alias/redirect maps; related-term/path maps; source and editorial pages; media manifest; validation results; migration/rollback notes; 90-day roadmap; scorecard; and the two competitive assessments.

Finish with: actual record count; unique published canonical count; entries upgraded; new entries added; entries merged/redirected; entries awaiting factual review; product-only score/position with scope; market assessment with evidence limits; largest remaining gap; and one next highest-value task. Never replace measured results with aspirational labels.

## 14. Technical references used for this consolidation

These primary references support the delivery requirements. They do not substantiate a current competitive ranking or the glossary's reported term count.

- [Google Search Central: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), crawlable links, rendering, metadata, canonical handling, and status codes.
- [Schema.org: DefinedTerm](https://schema.org/DefinedTerm), term/set relationships and supported properties.
- [Google Search Central: Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), matching markup to visible content and distinguishing schema vocabulary from supported search features.
- [W3C: WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/), accessibility criteria and manual review requirements.
- [web.dev: Web Vitals](https://web.dev/articles/vitals), performance metrics and field/lab measurement distinctions.

## 15. Additional findings from the October 2 repair

Henry authorized adding necessary issues found outside the original work order on October 2, 2026. The items below record confirmed findings from the repair, rather than speculative risks or a new expansion target. Completed repairs are included so a later agent does not repeat them. A verification gap is not a confirmed product defect.

**Current release:** https://crust-and-crumb-tawny.vercel.app/ now serves the repair deployment https://crust-and-crumb-1p4bzm2f1-henryhunterjrs-projects.vercel.app/ (`dpl_32huTaEXkAibBUnDfixAd9V2uEFh`). The original supplied URL above remains a historical, immutable build. The current release preserves 279 published canonical entries, 13 withheld drafts, and six paths. Five entries received source-supported corrections; the wider editorial roadmap remains open.

### ADD-01. Restore full AI services after the account is funded

**Status:** Owner action required; useful fallbacks are live. **Priority:** High if full AI functionality is part of launch. **Owner:** Henry for billing; release owner for activation and verification.

The connected Anthropic account returned an insufficient-credit-balance error for both Ask Krusty and Bread Analyzer. This is a confirmed service dependency. Ask Krusty now returns clearly labeled matching glossary definitions and canonical links when AI conversation is unavailable. Bread Analyzer pauses before the questionnaire/photo flow and offers troubleshooting links. These fallbacks do not establish that open-ended AI conversation or AI bake analysis is working.

After Henry restores credits, the release owner must verify a successful conversational request, set `BREAD_ANALYZER_ENABLED=true` in the production environment, redeploy, and verify a synthetic text-only analysis and an authorized test image. Check unavailable-service behavior as well as the successful path. Do not mark the feature restored merely because the environment variable exists. Credit purchases, billing changes, and uploading a visitor's private photo require their own authorization.

### ADD-02. Keep the dependency security repair reproducible

**Status:** Repaired and checked in this release. **Priority:** High. **Owner:** Release owner.

The prior framework/dependency versions had published security advisories. The repair uses Next.js 15.5.27 with patched dependency versions, a refreshed lockfile, and a compatible PostCSS override. Local and production installation audits reported zero known vulnerabilities at the time of verification; type checks and production builds passed. This is a dated result, not a permanent guarantee.

For future releases, use the committed lockfile, check current advisories, and repeat the relevant build/type/route checks after dependency changes. Do not accept a forced major upgrade solely to silence an audit. Keep the validation claims accurate: this project does not currently have an ESLint configuration, so an ESLint pass has not been established.

### ADD-03. Verify deployment ownership, team scope, and promotion

**Status:** Resolved for this release. **Priority:** High for future releases. **Owner:** Release owner.

Vercel blocked the first staging attempt because the inherited Git commit was not associated with the project team. A new commit under the workspace's configured account resolved that block. Promotion also required the correct explicit team scope. These findings add operational detail to the existing deployment and rollback requirements.

Before the next deployment, reconcile the linked project/team and configured commit identity. Do not change access controls to bypass a deployment block. Build with the intended production services, verify the staged deployment, promote it in the correct team, and inspect the permanent URL afterward. A build URL, a pushed branch, or a successful staging build is not proof that the permanent site serves that release. Use the permanent URL for the user handoff.

### ADD-04. Keep review artifacts and backups outside application builds

**Status:** Repaired in this release. **Priority:** High. **Owner:** Release owner.

A retained dependency backup under the reports folder was picked up by the local TypeScript scan and caused a build failure. The repair excludes reports from compilation and Vercel uploads, sets the application tracing root to its own checkout, and excludes dependency/lockfile backups from Git. This supplements the existing requirement to keep drafts and internal plans out of public output.

Retain a recoverable source baseline while ensuring that reports, old dependencies, internal plans, and credentials cannot enter public bundles or deployment uploads. Check the actual built public data; a UI filter alone does not prove that withheld records are absent from downloaded data. Keep deliverable reports available separately from the deployed application.

### ADD-05. Make assistant and analyzer attribution truthful

**Status:** Repaired in this release; retain as a regression check. **Priority:** High. **Owner:** Editorial and release owners.

The assistant's greeting claimed to use wisdom from Henry's book without verified book context. The dormant analyzer also attributed generated encouragement to Henry. The greeting now describes the actual glossary source, and analyzer-generated encouragement is labeled as AI baking guidance rather than a Henry quotation. This is a specific application of the original editorial-trust requirements.

Keep source access and review claims tied to evidence. Do not imply that the assistant has read an unavailable book, that Henry wrote a generated quote, or that a generic diagnostic score represents a verified bake assessment. Before restoring the analyzer, inspect its on-screen, print, and share outputs for truthful attribution, suitable uncertainty, and safe rendering of returned text.

### ADD-06. Close the saved-export verification gap

**Status:** Verification pending; no download defect confirmed. **Priority:** Medium. **Owner:** QA/release owner.

The in-app browser's download-event wait timed out during JSON export testing. The existing export requirement remains open at the saved-file level. Public export input contains the matching published catalog, but an actual newly saved file was not verified in that test.

Test JSON, CSV, and Markdown downloads in a browser with observable saved downloads. With no filters, verify 279 distinct published IDs; with a filtered view, verify the expected matching set, including records beyond the first 36 visible cards. Inspect CSV quoting and Markdown separators/newlines, and confirm that drafts and internal planning fields are absent. Record the saved file and its contents before marking export verification complete.

**Evidence and handoff:** Detailed checks, source references, limitations, and rollback notes are in [the October 2 review report](glossary-review-2026-10-02/reports/REVIEW-2026-10-02.md). The source and saved release evidence are on https://github.com/henryhunterjr/Crust-and-Crumb-Final/tree/codex/glossary-review-2026-10-02. These additions do not mark the catalog-wide scientific review, accessibility certification, field performance, or competitive benchmark complete.

When another necessary issue is confirmed, add a stable item ID, dated evidence, priority, current status, responsible owner, and a verifiable completion condition. Record whether it is new scope or a specific follow-up to an existing requirement. Proceed with reversible work inside Henry's authorized review-and-repair scope; record separately any owner decision, account funding, or other authorization still required.

## Appendix: Candidate coverage matrix

The lists below preserve the audit candidates in Perplexity's supplied work order and add missing coverage prompts from the earlier ChatGPT order. Repeated terms across categories indicate overlap, not additional unique entries. Verify each term and do not treat this list as proof that the current glossary lacks it.


### 7.1 Fresh-milled flour and home milling

Aged flour; Aleurone layer; Bagger’s formula [verify intended term before use]; Bolting; Bolted flour; Bran; Bran sharpness; Bran soaker; Cracked grain; Damaged starch; Endosperm; Extraction rate; Flour freshness; Fresh-milled flour; Freshly milled flour storage; Germ; Granulation; Home milling; Impact mill; Middlings; Milling; Milling temperature; Particle size; Sifted whole-grain flour; Stone milling; Tempering; Whole berry; Wheat berry.


### 7.2 Flour science and baker’s math

Ash content; Baker’s percentage; Baker’s math; Bassinage; Bread flour; Clear flour; Damaged starch; Desired dough temperature; Diastatic power; Diastatic malt; Dough yield; Falling number; Flour strength; Friction factor; Gluten quality; High-extraction flour; Hydration; Non-diastatic malt; P/L ratio; Patent flour; Protein content; Protein quality; Straight-grade flour; Type flour; W value; Water absorption.


### 7.3 Ancient, heritage, and specialty wheats

Ancient grain; Heritage grain; Heirloom grain; Landrace grain; Identity-preserved grain; Terroir; Modern wheat; Bread wheat; Common wheat; Hard wheat; Soft wheat; Hard red winter wheat; Hard red spring wheat; Hard white wheat; Soft white wheat; Soft red winter wheat; Winter wheat; Spring wheat; Wheat class; Einkorn; Emmer; Farro; Spelt; Khorasan wheat; KAMUT® brand khorasan wheat; Durum wheat; Semolina; Triticale; Red Fife; Turkey Red; Sonora wheat; Rouge de Bordeaux; Marquis wheat.


### 7.4 Rye and alternative grains

Rye; Rye sour; Rye flour; Whole rye flour; Light rye flour; Medium rye flour; Dark rye flour; Pumpernickel flour; Rye meal; Rye chops; Rye pentosans; Starch attack; Scald; Brühstück; Quellstück; Kochstück; Yudane; Tangzhong; Sourdough acidity in rye; Barley; Oat; Sorghum; Millet; Teff; Fonio; Buckwheat; Amaranth; Quinoa; Kañiwa; Cornmeal; Masa harina; Nixtamalization.


### 7.5 Sourdough, fermentation, and advanced home-baker concepts

Acetic acid; Aliquot jar; Autolyse; Bassinage; Bulk fermentation; Bulk fermentation target; Coil fold; Cold retard; Desired dough temperature; Fermentolyse; Feeding ratio; Friction factor; Inoculation; Lactic acid; Lactic acid bacteria; Levain; Mature starter; Overripe starter; Peak; pH; Ripe starter; Starter; Starter hydration; Stretch and fold; Tartine-style bread; Temperature; Titratable acidity; Young levain.


### 7.6 Dough handling, shaping, proofing, and baking

Banneton; Bâtard; Bench rest; Blowout; Boule; Coil fold; Couche; Crumb; Crumb structure; Degassing; Docking; Dutch oven; Ear; Final proof; Flying crust; Gluten window; Lamination; Oven spring; Poke test; Pre-shape; Proofing; Rice flour dusting; Rubaud method; Scoring; Slap and fold; Surface tension; Tension; Tunneling; Underproofed; Overproofed.


### 7.7 Preferments, leavening, and dough systems

Biga; Commercial yeast; Discard; Fermented dough; Instant yeast; Lievito madre; Liquid levain; Old dough; Pâte fermentée; Poolish; Preferment; Sourdough; Sponge; Stiff starter; Wild yeast; Yeast water.


### 7.8 Bread traditions and global vocabulary

**French and European**

Baguette; Bâtard; Boule; Couche; Levain; Pain au levain; Pain de campagne; Poolish; Pâte fermentée; Sauerteig; Vollkornbrot; Schrot; Pumpernickel; Brühstück; Quellstück; Kochstück; Biga; Lievito madre; Pane di semola; Semola rimacinata.

**Eastern European and rye traditions**

Borodinsky bread; Zavarka; Solod; Rye sour; Scalded rye bread.

**African and African-diaspora grain traditions**

Injera; Ersho; Teff; Fonio; Sorghum bread; Millet bread.

**Latin American traditions**

Masa; Masa harina; Nixtamalization; Pan dulce; Tortilla flour.

**South Asian traditions**

Atta; Chakki flour; Naan; Roti; Tandoor.


### 7.9 Tools, equipment, and home-baking workflow

Baking steel; Baking stone; Banneton; Bench knife; Cloche; Couche; Dough whisk; Dutch oven; Lame; Proofing box; Thermometer; Digital scale; Grain mill; Stone mill; Impact mill; Burr mill; Sieve; Flour sifter; Linen couche.


### 7.10 Troubleshooting and bread defects

Blowout; Dense crumb; Flat loaf; Flying crust; Gummy crumb; Lack of oven spring; Overproofing; Overfermentation; Tunneling; Underproofing; Underfermentation; Weak dough; Wet line; Starch attack; Poor gluten development; Collapsed loaf; Tight crumb; Open crumb; Cratered crumb.

### Additional candidates and checks from the earlier order

Acidification; amylase; brotform (alias check); carbon dioxide; enriched dough; elasticity; extensibility; gluten development; hard red wheat (class distinctions); hard white wheat; soft white wheat; Maillard reaction; retard (usage/alias check); rice flour; shaping; tension (scope/alias check); vital wheat gluten; windowpane (gluten-window alias check); yeast water.

Audit ingredients, enrichments, and storage coverage as well as technical grain vocabulary: salt; fat; sugar; milk; egg; inclusions; sandwich bread and rolls; braided bread; focaccia; ciabatta; baguettes; flatbreads; cooling; freezing/thawing; staling; rancidity; spoilage; and cross-contact. Add a term only when it improves bread learning or lookup. Use food-safety references for safety claims.

The final matrix must give each candidate a canonical entry or contextual destination, a current coverage status, an action, a priority, and a source/review requirement.
