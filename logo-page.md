---
layout: page
title: Carbon
permalink: /logo.html
---

<div class="logo-showcase">
  <span class="logo-hero" aria-hidden="true">{% include logo.svg %}</span>
</div>

## Why Carbon?

Carbon is the foundation of all known life. Every protein, every strand of DNA, every cell in your body is built on carbon bonds. It is the most versatile element in the periodic table -- capable of forming more compounds than all other elements combined.

**Carbon has exactly six electrons.** Six inner rings orbit the nucleus of the logo -- hover over it above to see them move. The logo is a carbon atom in disguise.

The philosophy is simple: **everything living is made of carbon, and everything I build is made of C and S.**

The logo is built entirely from my initials -- the letter C rotated six times forms the outer ring, and the letter S rotated forms each inner ring.

<style>
.logo-showcase {
  display: flex;
  justify-content: center;
  padding: 2rem 0 1rem;
}

.logo-hero {
  display: block;
  width: 120px;
  height: 120px;
  color: var(--heading);
}

.logo-hero svg {
  width: 100%;
  height: 100%;
}

.logo-hero svg .s-ring {
  animation: orbit 3s linear infinite;
  transform-origin: 53px 48.5px;
  transform-box: view-box;
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
