# Scoville

Pepper heat explorer, blend calculator, and dilution estimator. Static, no build, no dependencies. Open `app.html` or visit the GitHub Pages site.

## What it does

- **Blend a mash**: combine peppers by weight and get the weighted-average Scoville rating, a heat-level label, and the everyday pepper it matches.
- **Dilution**: see what happens to the heat when your mash goes into a full dish (mass-weighted).
- **Explore**: the reference table, bell pepper (0 SHU) to Carolina Reaper (up to 2.2M SHU).

## Heat levels

No heat 0, Trace <=500, Mild <=2,500, Medium <=10,000, Hot <=50,000, Very hot <=150,000, Extreme <=600,000, Superhot above.

## Data and limits

SHU ranges are published reference values; individual pods vary widely with growing conditions. Blends use range midpoints and mass weighting. Perceived heat is also shaped by fat, sugar, and acid, which the math does not model.

## Development

Pure JS engine (`engine.js`), browser and Node compatible. Tests run the engine against a python oracle (`tests/build_corpus.py` generates `tests/expected.json`):

```
python3 tests/build_corpus.py
node tests/run_tests.js
```

Built as app #395 of the app factory.
