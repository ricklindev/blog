---
title: "Rethinking the Work Behind AI Agents"
description: "The hard part of an agent is often understanding the work before trying to automate it."
publishedAt: 2026-09-03
updatedAt: 2026-09-04
tags:
  - AI
  - Product
cover: "./covers/work-before-automation.png"
draft: false
featured: true
---

Over the past few months, I have spent a lot of time building a product that I used to describe simply as an AI agent.

At first, I naturally began with the technical questions: planning, memory, tool calling, multi-agent systems, and whether the model needed a computer of its own. Those questions matter, but I no longer think they are the first questions.

> The hard part is not how to build an agent. It is understanding how the work is actually completed.

## I thought the technology would be the hard part

When you start building an agent, it is easy to ask:

- What should the model remember?
- Which tools should it call?
- How should prompts be divided?
- Does the system need several agents?

Each question has a real technical answer. But if you cannot describe how a reliable colleague would do the work, autonomy may only make the original confusion faster and larger.

## The real challenge is defining the problem

I now try to draw the existing workflow first. How does someone notice a useful signal? How do they decide it is worth pursuing? When do they ask another person for judgment? Which intermediate results need to remain visible?

```text
Observe
  ↓
Find a useful signal
  ↓
Form an angle
  ↓
Research
  ↓
Draft
  ↓
Human review
  ↓
Ready to publish
```

This sequence does not look especially agentic. It is still closer to the product than an architecture diagram.

## The agent comes later

Once the workflow is clear, an agent framework becomes useful. You know why it should pause, which state must remain, which tools it needs, and how a person can recover from failure.

Instead of asking whether to give a model more context, I now ask what a human colleague would need to know at this decision point.

## Where I have landed

I still like the direction of AI agents. But when someone asks how to build an AI coworker, I would start with a different question: how is the work you want it to take over actually done today?

If that is unclear, the automation may only formalize the ambiguity.
