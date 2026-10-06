---
description: Take an app idea through the 7-step workflow from idea to auto-redeployed app
argument-hint: <app idea>
---

Take this app idea from concept to a deployed, automatically redeployed application: $ARGUMENTS

Work through the 7 steps in order. Finish each step and report a one-line result before starting the next. If something is unclear or a step needs a decision from me, ask instead of guessing.

1. **Define the idea.** Restate what the app does, who uses it, and the core features. Keep the first version small and confirm the scope with me.
2. **Set up the project.** Make sure a git repo exists. Create or update `CLAUDE.md` with the tech stack, run and test commands, and any hard constraints.
3. **Plan.** Do not edit files yet. Propose the architecture, the files to create and the build order, then wait for my approval.
4. **Build.** Implement the plan in small steps and commit after each logical piece.
5. **Test and debug.** Run the app and any tests. Fix failures at the root cause, and never skip or disable a test to get green.
6. **Push to GitHub.** Push the work to the designated branch on the remote. Do not open a pull request unless I ask.
7. **Deploy with auto-redeploy.** Connect the repo to a host (Vercel, Netlify, GitHub Pages or similar) so every push to the main branch redeploys automatically. Tell me which host you picked and what I need to do in its dashboard, since you may not have access to it.

Finish with a summary: the live URL if there is one, what auto-redeploys, and anything still left for me to do.
