<img src="https://vrizo.net/whiteberries/whiteberry.png" width="266" height="269" alt="Whiteberries extension" />

# Whiteberries for stress-Free shopping

Removes annoying marketing tricks and "dark patterns" on marketplace websites. Focus on what really matters — buying your favorite products! Developed with customer experience experts using industry best practices, so you can enjoy shopping and save time.

## Packaged Versions

* [Mozilla Addons](#)
* Chrome Web Store

## How to Use

Current

1. Install the plugin
2. Open Ozon and enjoy the silence.

*Currently Ozon is the only marketplace supported.*

## Key Features

The plugin automatically hides these marketing gimmicks, letting you browse products without unnecessary distractions. It also simplifies the store interface by removing unnecessary effects, reducing visual clutter.

Specifically, on Ozon pages the plugin:

1. Reduces the brightness of overly vivid product images by 15%.
2. Hides tacky labels like "Best Price," "Weekly Discounts," and "Hot Sale" on products.
3. Hides misleading fake discount percentages.
4. Hides the bright red progress bar that shows how many items are left.
5. Moves the product description to the top: previously, it was buried under a bunch of useless recommendation and ad blocks, but now it's right below the product photo and price.
6. Hides annoying banners on the homepage with cringe texts like "Wheeeeekend Sales."
7. Hides recommended products that appear between reviews. Previously, a large block of recommended products would pop up after every third review, making it hard to read the reviews.
8. Removes the annoying flashing animation on the installment plan block.
9. Hides the floating header on the product page that takes up 15% of the screen, in case the user forgets the product name while scrolling.
10. Disables auto-playing video covers for products. Previously, random videos would start playing as you scrolled the page, but now they’re all blocked, even when you hover over them. Only the video for the current product will play, because that’s what the user is interested in at the moment.

## Development Usage

This project uses [`pnpm`](https://pnpm.io/installation#using-npm) to manage packages.

1. Run `pnpm install` to install all necessary packages
2. Add `sources/manifest.json` as a temporary plugin in `about:debugging`

Do not forget to remove `__MACOSX` and `.DS_Store` from the archive:

```bash
$ zip -d whiteberries-*.zip "*/*.DS_Store"
$ zip -d whiteberries-*.zip "__MACOSX/*"
```

## Todo

* Add Options (switch filters, disable "discounts" -83%)
* Add Wildberries
* Add international marketplaces

## Dependencies

This project uses the following open-source libraries:

- **ESLint**: MIT License ([link to license](https://github.com/eslint/eslint/blob/main/LICENSE))
- **Husky**: MIT License ([link to license](https://github.com/typicode/husky/blob/main/LICENSE))
- **Prettier**: MIT License ([link to license](https://github.com/prettier/prettier/blob/main/LICENSE))
- **lint-staged**: MIT License ([link to license](https://github.com/lint-staged/lint-staged/blob/master/LICENSE))

## Having any troubles or ideas?

Please create an issue or contact [me by email](mailto:vitalii.rizo@gmail.com).

## Special thanks

* :octocat: [Alexander Marfitsin @marfitsin](https://t.me/writingtools) — Text Refactoring

## Changelog

### 1.0
* Initial release
