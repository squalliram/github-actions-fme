# github-actions-fme

A demo project that wires **GitHub Actions** up to **Split.io's Feature Management & Experimentation (FME)** evaluator action, using **Selenium** as a sample test step.

The workflows use [`splitio/split-evaluator-action`](https://github.com/marketplace/actions/split-feature-flag-evaluator) to evaluate feature flags at CI time and then **conditionally run** Selenium tests, unit / integration tests, deploys and artifact publishes based on which flags are `on`. It is intended as a reference for how feature flags can drive CI/CD behaviour.

## What's inside

```
github-actions-fme/
├── .github/workflows/
│   ├── ci.yml             # End-to-end pipeline: evaluate flags → test → deploy → publish
│   └── selenium.yml       # Minimal "just run the Selenium test" workflow
├── package.json           # Selenium WebDriver + ChromeDriver dependencies
└── seleniumTest.js        # Headless-Chrome Selenium smoke test
```

### `seleniumTest.js`

A tiny headless Selenium test that opens `https://www.example.com` and prints the page title. Run with:

```bash
npm install
npm run test:selenium
```

### `.github/workflows/selenium.yml`

Runs the Selenium smoke test on every push / PR against `main`:

1. Checks out the code.
2. Sets up Node.js 18.
3. Installs Google Chrome via `browser-actions/setup-chrome@v1`.
4. Installs `chromedriver` and `selenium-webdriver`.
5. Runs `npm run test:selenium`.

### `.github/workflows/ci.yml`

A larger pipeline that branches on Split feature flags:

1. **`split_evaluation`** — uses `splitio/split-evaluator-action@v1.0.0` to evaluate the flags `B2C_customer_journey` and `dynamic_boxes` using `SPLIT_API_KEY` / `SPLIT_EVAL_KEY` from repo secrets, and exposes the result as `treatments` output.
2. **`test`** — runs the Selenium test **only when** `B2C_customer_journey == 'on'`.
3. **`deploy`** — echoes "Deploying to staging" **only when** `dynamic_boxes == 'on'`.
4. **`testing`** — runs unit & integration tests (and a B2C-specific integration test gated on the flag).
5. **`deploy_canary`** — gated deploy to a CANARY environment when `dynamic_boxes == 'on'`.
6. **`deploy_prod`** — deploy to PROD.
7. **`run_pipeline`** — additional canary / artifact-publish steps gated on the same flags (illustrative placeholders for JFrog publish, etc.).

## Required GitHub Secrets

Configure these under **Settings → Secrets and variables → Actions** to make the `ci.yml` workflow run end-to-end:

| Secret           | What it's for                                                |
| ---------------- | ------------------------------------------------------------ |
| `SPLIT_API_KEY`  | Split.io admin API key consumed by `split-evaluator-action`. |
| `SPLIT_EVAL_KEY` | The bucketing / targeting key used for flag evaluation.      |

## Local development

```bash
# Install dependencies
npm install

# Run the Selenium smoke test locally (needs Chrome installed)
npm run test:selenium
```

## License

No license file is included. This repository is intended as a demo / reference.
