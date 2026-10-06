---
description: Scan for secrets, then push to a GitHub repo and set up README, GitHub Pages, CI/CD and the About section
argument-hint: <github repo link>
---

Publish this project to the GitHub repository at: $ARGUMENTS

If no link was given above, ask me for it and stop. Parse `owner` and `repo` from the link. Work through the steps in order and report a one-line result for each. Use the `gh` CLI if it is installed and authenticated, otherwise the GitHub MCP tools. If neither can do a step (for example Pages settings or the About section), tell me the exact manual steps instead of skipping silently.

I listed the push first, but run the security scan first: nothing may be pushed until it passes.

1. **Security scan.** Check that no sensitive data will be uploaded.
   - Search tracked and untracked files (excluding `.git/`) for API keys, tokens, passwords, private keys, `.env` files, credentials JSON and connection strings. Look for patterns such as `AKIA`, `ghp_`, `github_pat_`, `sk-`, `xox[bpoa]-`, `-----BEGIN .* PRIVATE KEY-----`, `password\s*[:=]`, `secret`, `token`, and `api[_-]?key`.
   - Check for personal data: real email addresses, phone numbers and internal hostnames. An email address in a config constant is only acceptable if it is a placeholder. Never print a secret's value in your report; give only the file and line.
   - Check the git history of the branch about to be pushed, not only the working tree (`git log -p` searched for the same patterns).
   - Confirm a `.gitignore` covers `.env*`, key files, `node_modules/` and build output. Add what is missing.
   - If anything real is found, stop. Report where it is and what to do (remove it, rotate the credential, rewrite history). Do not push.
2. **Screenshot.** Use the Playwright MCP tools (`browser_resize` to 1440x900, `browser_navigate` to the app, e.g. `file://<abs path>/index.html` or the local dev URL, then `browser_take_screenshot` with `fullPage: true` and `filename: docs/screenshot.png`). Look at the image to confirm it shows the real app and no secrets or personal data. If the Playwright MCP browser fails to launch, fall back to a Playwright script that writes the same file. Commit `docs/screenshot.png`.
3. **README.** Create `README.md`, or edit the existing one. Cover what the project is, the screenshot embedded as `![Screenshot](docs/screenshot.png)`, a short feature list, how to run it locally, how it is deployed, and the live Pages link (filled in after step 5). Keep any accurate content already there.
4. **GitHub Actions for CI/CD.** Create `.github/workflows/ci.yml`:
   - On push and pull request: install dependencies and run the project's lint, build and test commands. Detect them from the repo. If there is no build step (a static site), run a basic check such as HTML validation or a link check.
   - On push to the default branch: deploy to GitHub Pages using `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`, with `permissions: pages: write, id-token: write, contents: read`.
   - Pin action versions and keep permissions to the minimum needed.
5. **GitHub Pages.** Make sure Pages is set to deploy from GitHub Actions (`gh api -X POST repos/OWNER/REPO/pages -f build_type=workflow`, or `PUT` if it already exists). The site URL is `https://OWNER.github.io/REPO/`. If the repo is private, check whether the plan supports Pages and tell me if it does not.
6. **Push.** Commit all changes with a clear message. Add the remote if missing (`git remote add origin <link>`), then push the current branch with `git push -u origin <branch>`. Do not force-push, and do not open a pull request unless I ask. If the push is rejected, report why instead of overwriting remote history.
7. **About section.** Set the repo description to a one-line summary and add relevant topics. Then add the Pages link as the website (`gh repo edit OWNER/REPO --description "..." --homepage "https://OWNER.github.io/REPO/" --add-topic ...`). Re-read the repo afterwards to confirm both fields are set.
8. **Verify.** Check that the Actions run on the pushed commit passed and that the Pages URL responds. If either fails, read the logs, fix the cause and push again. Never disable a check to get green.

Finish with a summary: the repo URL, the Pages URL, the CI status, the scan result, and anything I still need to do by hand.
