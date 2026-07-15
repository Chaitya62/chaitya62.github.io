---
layout: post
title: "The Age of Probabilistic Computing"
tagline: "We Put a Black Box in Production and Called It Progress"
categories:
image: /assets/probabilistic-computing.png
author: "Chaitya Shah"
meta: "AI, LLMs, Probabilistic Computing, Software Engineering, Evals, Reliability, AI Agents, Kyma"
comments: true
---

*We Put a Black Box in Production and Called It Progress*

*July 2026 · 10 min read*

![Deterministic logic enters a black box and emerges as many probabilistic outcomes](/assets/probabilistic-computing.png)

<p><small><em>From traceable logic to a distribution of plausible outcomes.</em></small></p>

<details>
<summary><strong>TL;DR (AI-generated summary, click to expand)</strong></summary>

<ul>
  <li>Previous software waves changed what we built. AI changes whether we can reason about the behavior we put into production.</li>
  <li>Temperature zero does not guarantee repeatable output on a typical inference stack. Server batching and floating-point reduction order can alter results.</li>
  <li>Prompt changes behave more like behavioral changes than ordinary configuration edits, while LLM-based evals remain statistical and biased instruments.</li>
  <li>The answer is not to avoid AI. It is to shrink the probabilistic surface area, version behavior, ground evals in humans and deterministic checks, and design for plausible wrongness.</li>
  <li>At Kyma, we are applying these ideas to AI-led financial-product sales, where trust, context, escalation, and auditability matter. We are hiring founding engineers.</li>
</ul>

<p><small>⚠️ <em>This TL;DR was AI-generated.</em></small></p>

</details>

## Table of Contents

1. [The Old Catch-Up Game](#the-old-catch-up-game)
2. [Then We Installed a Black Box](#then-we-installed-a-black-box)
3. [Temperature Zero Is Not a Warranty](#temperature-zero-is-not-a-warranty)
4. [The New Catch-Up Game](#the-new-catch-up-game)
5. [The Monkey Judging the Monkey](#the-monkey-judging-the-monkey)
6. [What This Era Actually Demands](#what-this-era-actually-demands)
7. [What This Means at Kyma](#what-this-means-at-kyma)
8. [A New Engineering Discipline](#a-new-engineering-discipline)

Every decade or so, the software industry collectively decides that every business needs the same thing.

In the late 1990s, everyone needed a website. Then every company needed to digitize: move the paper records into a database, establish a “digital presence,” put a portal in front of it. Then the smartphone arrived and every restaurant needed its own app, whether or not customers wanted to install one just to order dinner.

Today we are living through the same ritual with AI. Every roadmap has an AI line item. Every application needs a copilot, an assistant, or a “smart” feature. Some of these are genuinely transformative. Many are the restaurant app all over again.

But there is something different about this wave. Previous waves changed **what** we built. This one changes whether we can fully reason about what we built at all.

---

## The Old Catch-Up Game

Let's be honest about the world we are leaving behind, because nostalgia is a liar.

Traditional software engineering was never solved. We were always playing catch-up: to product demands, to scale, to the feature treadmill. Fast-moving companies accumulated technical debt like sediment: patches on patches, the module nobody dared touch, the migration that had been “next quarter” for three years. A lucky company eventually reached a plateau, stopped shipping long enough to breathe, and rewrote the ugly parts. Most did not.

The core difficulty of that era could still be stated simply: make sure the software correctly handles the states and scenarios it can encounter. Enumerate the states. Define the invariants. Handle the edge cases. Write the tests.

This was brutally hard in practice. State spaces explode, requirements change, distributed systems introduce concurrency and partial failure, and humans are terrible at imagining edge cases. Classical software was never perfectly deterministic in operation.

But its semantic core was inspectable. Given an input and the relevant state, an engineer could usually trace a path through the code and explain why an output occurred. Even when timing was nondeterministic, the program's intended rules were written somewhere. A race condition was a defect in the implementation, not the product's principal mode of reasoning.

That inspectability became the bedrock beneath debuggers, unit tests, type systems, CI pipelines, staging environments, and code review. We could not cover every path, but we could read the paths.

---

## Then We Installed a Black Box

An LLM-backed application changes that contract.

The model is steerable, but not specifiable in the way a function is. We can give it instructions, examples, tools, retrieved context, schemas, and guardrails. We can constrain the shape of an answer. We cannot read a branch in the model that says why this customer was classified one way rather than another.

That does not make the system unknowable. We can observe inputs and outputs, measure distributions, inspect tool calls, and build controls around the model. But the unit of reasoning has changed. We are no longer proving a path through explicit logic; we are estimating the behavior of a learned system over a distribution of inputs.

This distinction is easy to hide in a demo. A demo has a prepared prompt, a cooperative user, and no long tail. Production has ambiguous language, adversarial input, missing context, stale context, model updates, tool failures, policy changes, and users who say the same thing in a hundred different ways.

The model does not merely fail. It can be wrong in a way ordinary exceptions are not: fluent, plausible, and confident enough to keep the workflow moving.

That is not just another edge case. It is a new failure mode.

---

## Temperature Zero Is Not a Warranty

The usual response is: “Set temperature to zero. Then the output is deterministic.”

In theory, greedy decoding always selects the highest-probability next token. In a real inference stack, that is not the whole story.

In 2025, researchers at Thinking Machines Lab sent the same prompt through Qwen3-235B one thousand times at temperature zero and observed **80 unique completions**. The first 102 tokens matched; small numerical differences eventually changed a token, and the generations diverged from there. Their explanation is a systems one: optimized inference kernels are often not batch-invariant, so the order of floating-point reductions can change with the server's batch size. From the caller's perspective, other users and server load can therefore influence the result. Their batch-invariant implementation made all one thousand completions identical. ([Thinking Machines Lab](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/))

The important conclusion is not that LLMs are mystical or that reproducibility is impossible. It is almost the opposite.

Some variability is intentional sampling. Some comes from infrastructure. The latter is an engineering property we can understand and improve, with a performance cost that the Thinking Machines prototype made explicit. “LLMs are probabilistic” should not become an excuse for ignoring fixable nondeterminism.

It should, however, end the idea that `temperature: 0` is a reproducibility guarantee from a hosted API.

---

## The New Catch-Up Game

We have replaced one catch-up game with several at once.

### Speed

AI coding tools have raised the expected shipping velocity across the industry. The same technology that makes application behavior harder to verify also compresses the timeline for shipping it. We adopted tools that help us produce code faster at the exact moment the behavior inside that code became harder to trust.

More output is not automatically more understanding. It can simply mean we reach the unknown parts of the system faster.

### Fragility

In conventional code, a small syntactic change often has a bounded, reviewable effect. In an LLM system, a semantically minor prompt edit can move behavior in surprising ways.

This is not just folklore. An ICLR 2024 study tested meaning-preserving formatting changes in few-shot prompts, including separators, spacing, casing, and related choices. It found performance differences of up to **76 accuracy points** for LLaMA-2-13B in its experimental setting. Sensitivity persisted with larger models, more examples, and instruction tuning. ([Sclar et al., ICLR 2024](https://proceedings.iclr.cc/paper_files/paper/2024/hash/6c0e99d736da621403018ca7b32b1a4d-Abstract-Conference.html))

That number should not be lazily generalized to every modern model or task. The lesson is narrower and still serious: prompt formatting can be a behavior-bearing dependency, and the dependency may change across models. A prompt is not “just copy.” It is part of the program.

### Verification

When deterministic tests fail, they usually give us a fact: for this input and state, the result did not match the assertion.

When an eval score moves, it gives us an estimate. Did the system regress? Did the sampled cases change? Did the evaluator drift? Did the model under test change style without changing correctness? Did the judge prefer the new style? The signal is statistical, and often the measuring instrument is another model.

A green eval dashboard is useful. It is not the same claim as a green CI pipeline.

---

## The Monkey Judging the Monkey

This is the most uncomfortable part of the stack: one of our primary tools for evaluating LLM output at scale is another LLM.

We check the black box with a black box. The cheap version of that critique is “a monkey grading another monkey.” The research version is less funny.

LLM judges can show **position bias**, preferring an answer partly because of where it appears. They can show **verbosity bias**, rewarding longer answers even when length adds no value. They can show **self-enhancement or self-preference bias**, favoring outputs that resemble their own model family's style. These are not merely theoretical concerns; they appear across the original MT-Bench analysis and later studies involving multiple judges, tasks, and thousands of comparisons. ([Zheng et al.](https://arxiv.org/abs/2306.05685), [Shi et al.](https://arxiv.org/abs/2406.07791), [Wataoka et al.](https://arxiv.org/abs/2410.21819))

The deeper limitation is competence. Research on LLM judges without human grounding found that agreement with human annotators was strongly related to whether the judge could answer the underlying question itself. Human-written references produced the highest agreement. ([No Free Labels](https://arxiv.org/abs/2503.05061))

In other words, an evaluator is weakest near the frontier of its own understanding, exactly where subtle, consequential failures are likely to hide.

None of this makes LLM judges useless. They are fast, scalable, and often effective for well-defined, calibrated tasks. It means an eval is an instrument, and instruments need calibration. If the judge has never been compared with human decisions on your task, a precise-looking score may only be precisely measuring the judge's preferences.

---

## What This Era Actually Demands

The answer is not retreat. The capabilities are real, and sitting out this wave would be as naive as sitting out the web. But the discipline has to change shape.

### Shrink the black box

Use deterministic code for everything that can be deterministic. Let the model handle the genuinely fuzzy core: interpreting messy language, generating a useful draft, ranking ambiguous options. Put eligibility rules, calculations, permissions, schema validation, and irreversible actions in code.

Every rule pulled out of a prompt and into explicit logic is a rule we can inspect and test again.

### Treat behavior as a versioned artifact

Version prompts, model identifiers, tools, retrieval settings, and policies together. Review prompt changes. Run evals on the diff. Record what went into every consequential decision.

A model update is a dependency update. A prompt change is a behavior change. A retrieval change is a data change. All three can be deployments.

### Separate checks by what they are good at

Use code for properties code can verify: schema conformance, numerical correctness, permissions, allowed transitions, citation presence, and tool-call arguments. Use calibrated model judges for fuzzy qualities such as tone or relevance. Use humans for ambiguous, high-impact, or novel cases.

Do not ask a language model whether JSON is valid. Do not ask a regex whether advice is appropriate.

### Ground the evals

Build an evaluation set from real traffic, including failures and uncomfortable edge cases. Write reference answers where a reference is possible. Measure judge agreement against human labels before trusting it. Keep a difficult slice that humans review continuously, especially after model or prompt changes.

The goal is not one magical score. It is a collection of independent signals that fail differently.

### Design for graceful wrongness

Traditional systems are designed for visible failure: timeouts, exceptions, unavailable services. AI systems must also be designed for plausible wrongness.

That means bounded actions, confirmation before consequential steps, handoffs that preserve context, honest uncertainty in the interface, audit trails, and a safe recovery path. NIST's Generative AI Risk Management Profile treats confabulation as a distinct risk and places testing, evaluation, validation, and monitoring across the lifecycle rather than only at a final gate before launch. ([NIST AI 600-1](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf))

Human-in-the-loop is not a button labeled “ask a human.” It is a system design: when to escalate, what evidence to carry over, which actions to block, and how the workflow resumes.

---

## What This Means at Kyma

This problem is not abstract for me anymore. It is the work.

At [Kyma](https://kymahq.com/), we are building an AI salesperson for financial products. Kyma engages incoming customers, understands intent expressed in messy language, recommends the right path, and follows up without dropping the thread. The workflow can span qualification, consent, KYC, offer selection, drop-off recovery, and cross-sell before handing a complex case to a human with the transcript, stage, intent, and context intact.

That is a useful application of probabilistic computing precisely because the input is fuzzy. Customers do not speak in database enums. They hesitate, change their minds, mix languages, omit details, and return days later. A model can make that experience dramatically more natural.

But the destination is consequential. A financial product is not a playlist recommendation. The system has to combine conversational intelligence with deterministic workflow boundaries, auditability, product rules, consent, and reliable escalation. The job is not to pretend the black box is a normal function. It is to build the surrounding system so the model's flexibility is an advantage without allowing its uncertainty to become the customer's risk.

That is the area we are working in: making AI agents useful where conversations are messy, workflows are long-lived, and correctness matters.

We are also **hiring founding engineers**. If you want to work on agent architecture, evaluation, reliable tool use, conversational systems, and the infrastructure required to put probabilistic software into high-stakes production, I would like to hear from you. Visit [kymahq.com](https://kymahq.com/#careers) or write to me at [chaitya@kymahq.com](mailto:chaitya@kymahq.com).

---

## A New Engineering Discipline

Software engineering spent decades building on a powerful assumption: computation could be expressed as logic and, at least in principle, inspected. The web, cloud, and mobile waves stretched that discipline. They did not replace its semantic core.

LLM systems do.

We are not going back, and we should not. The question is whether we build a genuine engineering discipline for probabilistic software: better observability, reproducible inference, versioned behavior, grounded evaluation, bounded agency, and new definitions of “tested.”

Or whether we keep pointing deterministic-era instruments at learned systems and acting surprised when the dashboard is green and production is on fire.

Right now, much of the industry is doing the second.

The work ahead is to build the first.
