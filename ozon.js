/* global MutationObserver HTMLElement */


/**
 * Whiteberries
 * Ozon module
 */
const DEBUG = false;
const MAX_ITERATIONS = 2000;
const ALLOWED_CLASSNAMES_LIST = [ // TODO: rewrite this to a regex
    'tsBodyControl300XSmall',
    'tsBodyControl400Small',
    'tsHeadline600Medium',
    'tsHeadline500Medium',
    'tsBody200XSmall'
]


/**
 * HELPERS
 */
let addedStyles = '';

function addStyleRule (string) {
    /**
     * 1. Depending on the DEBUG mode, we either highlight the elements or hide them
     */
    if (DEBUG) {
        string = string.replace('display: none;', 'opacity: 0.3; background-color: orange;');
    } else {
        string = string.replace(';', ' !important;');
    }


    /**
     * 2. Do not apply styles to the root container
     */
    string = 'div:has(> div[data-widget="topBar"]) ' + string;


    /**
     * 3. Check if the style rule has already been added
     */
    if (addedStyles.includes(string)) {
        return;
    }
    addedStyles += string;


    /**
     * 4. Add the style to the head
     */
    let style = document.createElement('style');
    style.textContent = string;
    document.head.append(style);
}

function applyComplexRule (options) {
    /**
     * 1. Destructure the options
     */
    let {
        // The function to call when the target element is found
        callback,

        // The direction to search for the target element in relation to the selector element
        direction,

        // Whether to find all the elements or just the first one
        findAll,

        // Optional selector criteria (includes href)
        href,

        // The target element is the selector element itself
        isSpecificElement = false,

        // The minimum number of elements to match the selector criteria
        minElements = 3,

        // The select element type to search for
        selectorElementType,

        // The target element type to search for
        targetElementType,

        // Optional selector criteria (includes text)
        text
    } = options;


    /**
     * 2. Loop through the elements that matches SELECTOR criteria
     *    and find the elements that match the TARGET criteria
     */
    let selectorElements = document.querySelectorAll(selectorElementType);
    let targetElementClasses = {};

    for (let index = 0; index < selectorElements.length; index++) {
        let currElement = selectorElements[index];


        /**
         * 1. Check if the element meets the selector criteria
         */
        if (text) {
            let currElementText = currElement.textContent.trim();
            let regex = new RegExp(text, 'i');

            if (!regex.test(currElementText)) {
                continue;
            }
        }
        else if (href && !currElement.href.includes(href)) {
            continue;
        }


        /**
         * 2. Find the target element based on the direction in relation to the selector element
         */
        let targetElement;
        if (direction === 'parent') {
            targetElement = currElement.closest(targetElementType);
        }
        else if (direction === 'child') {
            targetElement = currElement.querySelector(targetElementType);
        }
        else if (direction === 'this') {
            targetElement = currElement;
        }

        if (!targetElement) {
            continue;
        }


        /**
         * 3. If the target element is the selector element itself, call the callback immediately
         */
        if (isSpecificElement) {
            callback(targetElement);
            break;
        }


        /**
         * 4. Count the number of elements that match the target criteria (by class name only)
         */
        let targetElementClass = [...targetElement.classList].filter(
            className => !ALLOWED_CLASSNAMES_LIST.includes(className)
        )[0];

        if (!targetElementClass) {
            continue;
        }

        if (!targetElementClasses[targetElementClass]) {
            targetElementClasses[targetElementClass] = 1;
        }
        targetElementClasses[targetElementClass]++;


        /**
         * 5. Call the callback if the number of elements matches the minimum amount criteria
         */
        if (targetElementClasses[targetElementClass] === minElements) {
            callback(targetElementClass);

            // Break the loop if we only need to find the first element
            if (!findAll) {
                break;
            }
        }


        /**
         * 6. Break the loop if we've reached the limit of iterations
         */
        if (index > MAX_ITERATIONS) {
            break;
        }
    };
}


/**
 * RULES
 */
const RULES = [
    // Desaturate super bright images
    {
        callback: imgClass => {
            addStyleRule(
                `.${imgClass} { filter: saturate(85%); }`
            )
        },
        direction: 'child',
        findAll: true,
        href: '/product/',
        selectorElementType: 'a',
        targetElementType: 'img'
    },

    // Hide islands with banners
    {
        callback: targetElement => {
            targetElement.style = 'display: none;';
        },
        direction: 'parent',
        isSpecificElement: true,
        selectorElementType: 'div',
        targetElementType: 'div[data-widget="freshIsland"]',
        text: 'Реклама'
    },

    // Hide stupid labels on the product on the homepage (right side)
    {
        callback: sectionClass => {
            addStyleRule(
                `.${sectionClass} { display: none; }`
            )
        },
        direction: 'parent',
        selectorElementType: 'div',
        targetElementType: 'section',
        text: 'Скидки недели|Распродажа|Цена что надо|Цена недели'
    },

    // Hide stupid labels on the product on the homepage (left side)
    {
        callback: sectionClass => {
            addStyleRule(
                `.${sectionClass} { display: none; }`
            )
        },
        direction: 'parent',
        selectorElementType: 'div',
        targetElementType: 'section',
        text: 'Осталось .+ шт'
    },

    // Hide percentage of fake discounts
    {
        callback: sectionClass => {
            addStyleRule(
                `span.${sectionClass}, span.${sectionClass} + span { display: none; }`
            )
        },
        direction: 'this',
        selectorElementType: 'span',
        text: '[0-9]{1,2}%'
    },

    // Hide the "Left items" section
    {
        callback: sectionClass => {
            addStyleRule(
                `.${sectionClass} { display: none; }`
            )
        },
        direction: 'parent',
        selectorElementType: 'span',
        targetElementType: 'div',
        text: 'Осталось'
    },

    // Remove stupid labels under the product image
    {
        callback: targetElement => {
            targetElement.style = 'display: none;';
        },
        direction: 'parent',
        isSpecificElement: true,
        selectorElementType: 'span',
        targetElementType: 'li',
        text: 'Цены что надо'
    },

    // Move product description to the top
    {
        callback: targetElement => {
            // Find the parent element
            let parentDiv = targetElement.parentNode;

            // Move the product description to the top of the parent
            parentDiv.prepend(targetElement);

            targetElement.style = 'margin-top: 20px;';
        },
        direction: 'parent',
        isSpecificElement: true,
        selectorElementType: 'h2',
        targetElementType: 'div[data-widget="row"]',
        text: 'Описание'
    },

    // Recommended items in search
    {
        callback: targetElement => {
            targetElement.style = 'display: none;';
        },
        direction: 'parent',
        isSpecificElement: true,
        selectorElementType: 'span',
        targetElementType: 'div[data-widget="column"]',
        text: 'Рекомендуем для вас'
    },

    // "Original"  label after the product name in recommendations
    {
        callback: targetElement => {
            targetElement.style = 'display: none;';
        },
        direction: 'parent',
        isSpecificElement: true,
        selectorElementType: 'b',
        targetElementType: 'span:has(> svg)',
        text: 'Оригинал'
    },

    // Banners on the home page
    'div[data-widget="advBanner"] { display: none; }',
    'div[data-widget="advBanner"] + div[data-widget="separator"] { display: none; }',
    'div[data-widget="island"]:has(> div > div[data-widget="objectBannerList"]) { display: none; }',
    'div[data-widget="island"]:has(> div > div[data-widget="objectBannerList"]) + div[data-widget="separator"] { display: none; }',
    'div[data-widget="objectBannerList"] { display: none; }',
    'div[data-widget="objectBannerList"] + div[data-widget="separator"] { display: none; }',
    'div:has(> div > div[data-widget="banner"]) { display: none; }',
    'div:has(> div > div[data-widget="seasonWidget"]) { display: none; }',
    'div:has(> div > div[data-widget="seasonWidget"]) + div[data-widget="separator"] { display: none; }',
    'div[data-widget="island"]:has(> div > div > div > div[data-widget="seasonWidget"]) { display: none; }',
    'div:has(> div > div > div > div[data-widget="seasonWidget"]) + div[data-widget="separator"] { display: none; }',

    // Banners on category pages
    'div[data-widget="bannerCarousel"] { display: none; }',

    // Stupid labels for products
    'div:has(> div > div[data-widget="webMarketingLabels"]) { display: none; }',

    // Promotions on the product page
    'div[data-widget="objectBannerList"] { display: none; }',
    'div[data-widget="objectBannerList"] + div[data-widget="separator"] { display: none; }',

    // Recommended and similar items between reviews
    'div[data-widget="freshIsland"]:has(> div > div > div > a[href*="/category/"]) { display: none; }',
    'div[data-widget="freshIsland"]:has(> div > div > div > a[href*="/category/"]) + div[data-widget="separator"] { display: none; }',
    'div[data-widget="freshIsland"]:has(> div > div > div > a[href*="/brand/"]) { display: none; }',
    'div[data-widget="freshIsland"]:has(> div > div > div > a[href*="/brand/"]) + div[data-widget="separator"] { display: none; }',
    'div[data-widget="webListReviews"] + div + div[data-widget="skuGrid"] { display: none; }',

    // Ozon label on buy button
    'div[type="addToCartButtonWithQuantity"] > span > svg { display: none; }',

    // Discounts of week with counter of items left
    'div[data-widget="bigPromoPDP"] { display: none; }',

    // "Cheaper now" block
    'div[data-widget="webPriceDecreasedCompact"] { display: none; }',

    // Animation on the installment purchase block
    'div[data-widget="webInstallmentPurchase"] > div > div:last-of-type { display: none; }',

    // Sticky header on the product page
    'div[data-widget="webStickyProducts"] { display: none; }',

    // Video trigger on mouse leave on product images
    'a[href*="/product/"] > div > div { pointer-events: none; }',

    // Hide annoying autoplayed videos in product cards
    'video-player-super-lite { display: none; }',
    'div:has(video-player-super-lite) > img { display: block; }',

    // Feedback form
    'div[data-widget="webFeedbackForm"] { display: none; }',
]


/**
 * MAIN
 */
const applyRules = () => {
    RULES.forEach(rule => {
        if (typeof rule === 'string') {
            addStyleRule(rule);
        } else {
            applyComplexRule(rule)
        }
    });
}

if (document.readyState !== 'loading') {
    applyRules();
} else {
    document.addEventListener('DOMContentLoaded', applyRules);
}

setTimeout(applyRules, 2500);
setTimeout(applyRules, 3000);

// Create a new observer instance to watch for loading of the reviews
const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
        if (mutation.type !== 'childList') {
            continue;
        }

        let addedNodes = mutation.addedNodes;

        for (let node of addedNodes) {
            if (
                node instanceof HTMLElement &&
                (
                    node.getAttribute('data-widget') === 'webReviewTabs' ||
                    node.getAttribute('data-widget') === 'webSuggestions' ||
                    node.getAttribute('data-widget') === 'skuGrid'
                )
            ) {
                setTimeout(applyRules, 1);
                setTimeout(applyRules, 100);
                break;
            }
        }
    }
});

observer.observe(document, {childList: true, subtree: true});