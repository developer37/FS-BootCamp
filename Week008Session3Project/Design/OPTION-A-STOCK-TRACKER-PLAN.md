# Option A: Stock Tracker Implementation Plan

This is a Stock tracker application

## Base Features Only - Required Features from Rubric

This plan focuses on implementing the MINIMUM required features to pass. Build features one at a time and test each before moving to the next.

## Remember

**If you can't solve the harder problem, solve the easier problem.**

Start with the absolute basics and add features one at a time. Each feature should be fully working before moving to the next.

Try to commit as you go, this will make it easier to roll back code if you have issues.

---

## Step 1: REQUIRED - Create Your Project Files

**RUBRIC REQUIREMENT:** Separate HTML, CSS, and JS files

Create three files in existing src folder:

- `index.html` - The structure of your page
- `styles.css` - All styling
- `app.js` - All JavaScript functionality

---

## Step 2: OPTIONAL - Plan Your Layout

**BEST PRACTICE (Not a rubric requirement, but highly recommended)**

Before coding, sketch out or wireframe your app layout using Figma, Excalidraw, or paper.

**Note:** The rubric only requires the final app to be responsive - it doesn't require planning. However, planning will make building much easier!

**Required Sections to Include:**

1. Header with app title and total portfolio value display
2. Search section with input field and search button
3. Stock details display area (hidden initially)
4. Watchlist section showing saved stocks
5. Review StockTracker.png for a layout


---

## Step 3: REQUIRED - Build the HTML Structure (Static First)

**RUBRIC REQUIREMENT:** Dynamic content display structure

Create the basic HTML skeleton WITHOUT any functionality:

**What to include:**

```
- Header with title "Stock Tracker" and total portfolio value
- Search input field
- Search button
- Empty div for stock details (will be filled with JavaScript)
- Empty div for watchlist (will be filled with JavaScript)
```

**Test:** Open `index.html` in your browser. You should see all sections, but nothing works yet.

---

## Step 4: REQUIRED - Style Your App with CSS

**RUBRIC REQUIREMENT:** Responsive design for different screen sizes

Now make it look professional:

**Required CSS:**

- Layout using Flexbox
- Consistent spacing (use multiples of 8px)
- High contrast colors for readability
- Styled buttons with hover effects
- Card-style containers for stock info
- Responsive design (works on mobile and desktop)

**Test:** Resize your browser window. Everything should look good at different sizes.

---

## Step 5: REQUIRED - Find and Test Your API in POSTMAN with the Auth

**RUBRIC REQUIREMENT:** Successfully connects to public API using Fetch API

**CRITICAL STEP:** You need a working API before coding JavaScript.

**Recommended API:** Alpha Vantage (free tier available) - only 25 req/day

1. Go to https://www.alphavantage.co/support/#api-key
2. Sign up for a FREE API key
3. Read the documentation for the "GLOBAL_QUOTE" endpoint
4. Test your API using Postman or your browser

**Test this URL in your browser:**

```
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=BH567H5VJX7QDBCF
```

**You should see JSON data with stock information.**


**IMPORTANT:** Never commit your API key to GitHub. Use a separate config file.

---

## Step 6: REQUIRED - Implement Stock Search Feature

**RUBRIC REQUIREMENT:** Stock search functionality - Users can search for stocks by symbol or company name

**What to code:**

1. Get references to search input and button using `querySelector`
2. Add click event listener to search button
3. Create async function that:
   - Gets the search value from input
   - Validates it's not empty
   - Calls the API with the stock symbol
   - Handles errors with try/catch
   - Logs the result to console

**Test:** Search for "AAPL". You should see stock data in the console.

---

## Step 7: REQUIRED - Display Stock Data on Page

**RUBRIC REQUIREMENT:** Real-time price display - Shows current stock prices, daily change, and percentage change

**What to code:**

1. Create a function that takes stock data and displays it on the page
2. Update the stock details section with:
   - Stock symbol and name
   - Current price
   - Price change (with + or - sign)
   - Percentage change
3. Use innerHTML or textContent to update DOM elements
4. Add CSS class for positive (green) or negative (red) changes

**Test:** Search for a stock. The details should appear on the page with correct formatting.

---

## Step 8: OPTIONAL - Show Loading State

**RUBRIC BONUS FEATURE:** Loading states - Implements loading indicators during API operations

**Note:** This is listed under "Could Have (Bonus Points)" in the rubric, NOT required for passing. However, it greatly improves user experience!

**What to code:**

1. Create a loading spinner element in HTML (can be hidden initially)
2. Create functions to show and hide the loading indicator
3. Show loading BEFORE API call
4. Hide loading AFTER data is received or error occurs

**Test:** Search for a stock. You should see a loading spinner while waiting for results.

---

## Step 8: REQUIRED - Add Error Handling

**RUBRIC REQUIREMENT:** Error handling - Network error management with user-friendly messaging

**What to code:**

1. Create an error display element in HTML
2. Add try/catch blocks to all API calls
3. Check if response.ok before processing data
4. Display helpful error messages to users:
   - "Stock symbol not found"
   - "Network error. Check your connection."
   - "API error. Try again later."

**Test:**

- Search for "INVALID123" - should show "stock not found" error
- Turn off WiFi and search - should show network error

---

## Step 9: REQUIRED - Implement Portfolio Tracking with LocalStorage

**RUBRIC REQUIREMENT:** Portfolio tracking - Users can enter how many shares they own, stored in localStorage

**What to code:**

1. Add input field for number of shares
2. Add "Update Shares" button
3. Create function to save shares to localStorage (Dont forget JSON.stringify)
4. Load portfolio data when page loads
5. Display total value of each position (shares \* current price)

**Test:**

- Enter 10 shares for a stock and update
- Refresh the page
- The 10 shares should still be displayed

---

## Step 10: REQUIRED - Calculate and Display Portfolio Total Value

**RUBRIC REQUIREMENT:** Track performance - Shows total value of stocks owned

**What to code:**

1. Create function to calculate total portfolio value
2. Loop through all stocks in portfolio
3. Multiply shares by current price for each stock
4. Sum up all position values
5. Display total in header

**Test:** Add shares for 2-3 different stocks. Total value in header should update correctly.

---

## Step 11: REQUIRED - Implement Watchlist Feature

**RUBRIC REQUIREMENT:** Watchlist - Allow users to add stocks to watchlist (localStorage)

**What to code:**

1. Add "Add to Watchlist" button when stock is displayed
2. Create watchlist array in localStorage
3. Add current stock to watchlist when button is clicked
4. Display all watchlist stocks in a list
5. Prevent adding duplicate stocks

**Test:**

- Add 3 stocks to watchlist
- Refresh page
- All 3 stocks should still be in watchlist

---

## Step 12: REQUIRED - Add Remove from Watchlist

**RUBRIC REQUIREMENT:** Data persistence - Manage localStorage data

**What to code:**

1. Add remove button next to each watchlist item
2. Create function to remove stock from watchlist array
3. Update localStorage
4. Re-render the watchlist

**Test:** Remove a stock from watchlist. It should disappear and stay removed after refresh.

---

## Step 13: REQUIRED - Make It Responsive

**RUBRIC REQUIREMENT:** Responsive design - Interface works properly on different screen sizes

**What is actually required:**

1. **Mobile responsive** - App works on phones, tablets, and desktops
2. **Basic readability** - Text is legible, buttons are clickable
3. **Layout doesn't break** - Content displays properly at different widths

**Test:** Resize your browser window from phone size to desktop. Everything should still work and be readable.

---

## Step 14: OPTIONAL - Add Professional Polish

**BEST PRACTICE (Not required by rubric, but makes your app look better)**

**Optional styling enhancements:**

1. Consistent spacing and alignment
2. Clear visual hierarchy (larger text for important info)
3. Smooth transitions on hover
4. Icons for buttons
5. Proper color coding (green for gains, red for losses)

**Test:** Show it to a friend. Can they use it without explanation?

---

## Step 15: REQUIRED - Test All Required Features

**VALIDATION CHECKPOINT:** Ensure you've met all rubric requirements before submission

Go through the rubric and check off each requirement:

**Files:**

- [ ] Separate HTML, CSS, and JS files

**Security:**

- [ ] API key not in code (use separate config or environment variable)

**API Integration:**

- [ ] Successfully connects to stock API
- [ ] Uses fetch with async/await or .then()
- [ ] Handles errors with try/catch

**Stock Search:**

- [ ] Users can search by stock symbol
- [ ] Displays current price
- [ ] Shows daily change and percentage change

**Portfolio:**

- [ ] Users can enter number of shares
- [ ] Shares stored in localStorage
- [ ] Shows total value of stocks owned

**Watchlist:**

- [ ] Users can add stocks to watchlist
- [ ] Watchlist persists in localStorage

**UI:**

- [ ] Dynamic content display
- [ ] Loading indicator during API calls
- [ ] Error messages shown to user
- [ ] Responsive design

---

## Common Problems and Solutions

### Problem: API returns "Invalid API Key"

**Solution:**

- Double-check you copied the API key correctly
- Make sure there are no extra spaces
- Verify the API key is active on the provider's website

### Problem: API returns "Rate limit exceeded"

**Solution:**

- Free APIs have limited requests per minute
- Wait 60 seconds and try again
- Consider using demo/mock data for development

### Problem: Stock data not displaying

**Solution:**

- Check browser console for errors
- Verify the API response structure matches your code
- Use `console.log(data)` to see what the API actually returns

### Problem: LocalStorage not working

**Solution:**

- Check browser privacy settings
- Try opening in regular window (not private/incognito)
- Verify you're using `JSON.stringify()` when saving and `JSON.parse()` when loading

### Problem: Stock symbol not found

**Solution:**

- Make sure to use proper stock symbols (AAPL, GOOGL, MSFT, etc.)
- Some APIs only support US stocks
- Check API documentation for supported exchanges

---

## Optional Enhancements (Bonus Points)

Only add these AFTER all required features work:

1. **Picker Modal** - Show multiple options when search is ambiguous (RUBRIC BONUS)
2. **More Stock Data** - Display volume, high, low, open prices (RUBRIC BONUS)
3. **Quick Search Buttons** - Add quick access buttons for popular stocks (AAPL, GOOGL, MSFT)
4. **Refresh Watchlist** - Auto-update prices for all watchlist stocks
5. **Stock Charts** - Add price history visualization
6. **Export Data** - Download portfolio as CSV or JSON
7. **Portfolio Summary Dashboard** - Display top performer, today's change, etc.

---

## Final Checklist Before Submission

- [ ] All required features implemented and tested
- [ ] No errors in browser console
- [ ] API key not committed to GitHub
- [ ] README file with setup instructions
- [ ] Code is commented and organized
- [ ] App works on mobile and desktop
- [ ] Tested with multiple stocks
- [ ] Portfolio persists after page refresh
- [ ] Error messages are user-friendly

---
