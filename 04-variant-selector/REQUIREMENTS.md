# Requirements — Product Variant Selector

- A variant that is out of stock must never be addable to the cart.
- Prices must always be displayed correctly formatted, regardless of the internal data type they arrive in.
- When the user changes the selected color, if the currently-selected size is still available for the new color, it must remain selected. If it is not available for the new color, the UI should automatically select the first available size for that color instead.
- The add-to-cart action must never crash or throw an error for any valid color/size combination the UI allows the user to select.
