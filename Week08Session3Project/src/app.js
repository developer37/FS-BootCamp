import stockTrackerConfig from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  // Local catalog helps narrow broad company-name searches before the API lookup.
  const STOCK_CATALOG = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporation" },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com, Inc." },
    { symbol: "TSLA", name: "Tesla, Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "META", name: "Meta Platforms, Inc." },
    { symbol: "NFLX", name: "Netflix, Inc." },
    { symbol: "AMD", name: "Advanced Micro Devices, Inc." },
    { symbol: "INTC", name: "Intel Corporation" },
    { symbol: "ORCL", name: "Oracle Corporation" },
    { symbol: "CRM", name: "Salesforce, Inc." },
    { symbol: "JPM", name: "JPMorgan Chase & Co." },
    { symbol: "V", name: "Visa Inc." },
    { symbol: "MA", name: "Mastercard Incorporated" },
    { symbol: "KO", name: "The Coca-Cola Company" },
    { symbol: "PEP", name: "PepsiCo, Inc." },
    { symbol: "WMT", name: "Walmart Inc." },
    { symbol: "DIS", name: "The Walt Disney Company" },
    { symbol: "BAC", name: "Bank of America Corporation" },
  ];

  const QUICK_SEARCHES = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"];
  const ALPHA_VANTAGE_API_KEY = stockTrackerConfig?.ALPHA_VANTAGE_API_KEY || "";
  const TWELVE_DATA_API_KEY = stockTrackerConfig?.TWELVE_DATA_API_KEY || "";
  const PORTFOLIO_KEY = "stocktracker.portfolio";
  const WATCHLIST_KEY = "stocktracker.watchlist";
  const CACHE_KEY = "stocktracker.quote-cache";

  const elements = {
    portfolioValue: document.getElementById("portfolio-value"),
    stocksOwned: document.getElementById("stocks-owned"),
    searchForm: document.getElementById("search-form"),
    searchInput: document.getElementById("search-input"),
    statusMessage: document.getElementById("status-message"),
    loadingState: document.getElementById("loading-state"),
    searchMatches: document.getElementById("search-matches"),
    quickSearchButtons: document.getElementById("quick-search-buttons"),
    stockDetails: document.getElementById("stock-details"),
    stockSymbol: document.getElementById("stock-symbol"),
    stockName: document.getElementById("stock-name"),
    stockPrice: document.getElementById("stock-price"),
    stockChange: document.getElementById("stock-change"),
    stockOpen: document.getElementById("stock-open"),
    stockHigh: document.getElementById("stock-high"),
    stockLow: document.getElementById("stock-low"),
    stockVolume: document.getElementById("stock-volume"),
    sharesInput: document.getElementById("shares-input"),
    sharesHeld: document.getElementById("shares-held"),
    saveShares: document.getElementById("save-shares"),
    positionValue: document.getElementById("position-value"),
    watchlistToggle: document.getElementById("watchlist-toggle"),
    watchlistEmpty: document.getElementById("watchlist-empty"),
    watchlistList: document.getElementById("watchlist-list"),
    refreshWatchlist: document.getElementById("refresh-watchlist"),
    resetPortfolio: document.getElementById("reset-portfolio"),
    summaryTotal: document.getElementById("summary-total"),
    summaryPositions: document.getElementById("summary-positions"),
    summaryTop: document.getElementById("summary-top"),
    summaryChange: document.getElementById("summary-change"),
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const numberFormatter = new Intl.NumberFormat("en-US");

  const state = {
    currentStock: null,
    selectedMatches: [],
    watchlist: loadJson(WATCHLIST_KEY, []),
    portfolio: loadJson(PORTFOLIO_KEY, {}),
    quoteCache: loadJson(CACHE_KEY, {}),
    quoteMap: {},
  };

  // localStorage helpers keep portfolio data, watchlist data, and quote cache in sync.
  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCatalogMatches(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return STOCK_CATALOG.filter(({ symbol, name }) => {
      return (
        symbol.toLowerCase() === normalized ||
        name.toLowerCase().includes(normalized)
      );
    });
  }

  function findCompanyBySymbol(symbol) {
    return (
      STOCK_CATALOG.find((entry) => entry.symbol === symbol.toUpperCase()) ||
      null
    );
  }

  function formatCurrency(value) {
    return currencyFormatter.format(Number.isFinite(value) ? value : 0);
  }

  function formatNumber(value) {
    return numberFormatter.format(Number.isFinite(value) ? value : 0);
  }

  function formatSignedCurrency(value) {
    const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
    return `${prefix}${currencyFormatter.format(Math.abs(value || 0))}`;
  }

  function formatSignedPercent(value) {
    const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
    return `${prefix}${Math.abs(value || 0).toFixed(2)}%`;
  }

  function setStatus(message, type = "") {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message${type ? ` ${type}` : ""}`;
  }

  function setLoading(isLoading) {
    elements.loadingState.classList.toggle("hidden", !isLoading);
    elements.searchForm.querySelector("button[type='submit']").disabled =
      isLoading;
  }

  function setMatches(matches) {
    state.selectedMatches = matches;
    elements.searchMatches.innerHTML = "";

    if (!matches.length) {
      elements.searchMatches.classList.add("hidden");
      return;
    }

    const fragment = document.createDocumentFragment();
    matches.forEach((match) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "match-button";
      button.innerHTML = `
        <span>${match.symbol}</span>
        <span class="match-meta">${match.name}${match.region ? ` • ${match.region}` : ""}${match.matchScore ? ` • ${Math.round(match.matchScore * 100)}%` : ""}</span>
      `;
      button.addEventListener("click", () => lookupStock(match.symbol));
      fragment.appendChild(button);
    });

    elements.searchMatches.appendChild(fragment);
    elements.searchMatches.classList.remove("hidden");
  }

  // Quick search buttons jump straight to a known symbol lookup.
  function renderQuickSearches() {
    elements.quickSearchButtons.innerHTML = "";
    QUICK_SEARCHES.forEach((symbol) => {
      const company = findCompanyBySymbol(symbol);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chip-button";
      button.textContent = symbol;
      button.title = company ? company.name : symbol;
      button.addEventListener("click", () => searchStock(symbol));
      elements.quickSearchButtons.appendChild(button);
    });
  }

  function normalizeRemoteQuote(rawQuote, company, symbol) {
    return {
      symbol,
      name: rawQuote.name || company?.name || symbol,
      price: Number(rawQuote.price),
      change: Number(rawQuote.change ?? 0),
      changePercent: Number(
        String(
          rawQuote.changesPercentage ?? rawQuote.changePercent ?? 0,
        ).replace(/[%()]/g, ""),
      ),
      open: Number(rawQuote.open ?? rawQuote.previousClose ?? rawQuote.price),
      high: Number(rawQuote.dayHigh ?? rawQuote.high ?? rawQuote.price),
      low: Number(rawQuote.dayLow ?? rawQuote.low ?? rawQuote.price),
      volume: Number(rawQuote.volume ?? 0),
    };
  }

  function normalizeAlphaVantageQuote(payload, company, symbol) {
    const quote = payload?.["Global Quote"] || {};
    const price = Number(quote["05. price"]);
    const change = Number(quote["09. change"]);
    const changePercent = Number(
      String(quote["10. change percent"] || "0").replace("%", ""),
    );

    return {
      symbol: quote["01. symbol"] || symbol,
      name: company?.name || symbol,
      price,
      change,
      changePercent,
      open: Number(quote["02. open"] || price),
      high: Number(quote["03. high"] || price),
      low: Number(quote["04. low"] || price),
      volume: Number(quote["06. volume"] || 0),
    };
  }

  function normalizeAlphaVantageSearchMatch(match) {
    if (!match) {
      return null;
    }

    return {
      symbol: match["1. symbol"] || "",
      name: match["2. name"] || "",
      type: match["3. type"] || "",
      region: match["4. region"] || "",
      marketOpen: match["5. marketOpen"] || "",
      marketClose: match["6. marketClose"] || "",
      timezone: match["7. timezone"] || "",
      currency: match["8. currency"] || "",
      matchScore: Number(match["9. matchScore"] || 0),
    };
  }

  function isAlphaVantageDailyLimitExceeded(payload) {
    const note =
      `${payload?.Note || ""} ${payload?.Information || ""} ${payload?.ErrorMessage || ""}`.toLowerCase();
    return (
      note.includes("daily token limit exceeded") ||
      note.includes("thank you for using alpha vantage")
    );
  }

  function normalizeTwelveDataQuote(payload, company, symbol) {
    const values = Array.isArray(payload?.values) ? payload.values : [];
    const current = values[0] || {};
    const previous = values[1] || current;
    const price = Number(current.close);
    const previousClose = Number(previous.close || price);
    const change = price - previousClose;
    const changePercent =
      previousClose === 0 ? 0 : (change / previousClose) * 100;

    return {
      symbol: payload?.meta?.symbol || symbol,
      name: company?.name || symbol,
      price,
      change,
      changePercent,
      open: Number(current.open || price),
      high: Number(current.high || price),
      low: Number(current.low || price),
      volume: Number(current.volume || 0),
    };
  }

  async function fetchTwelveDataQuote(symbol, company) {
    if (!TWELVE_DATA_API_KEY) {
      return null;
    }

    try {
      const response = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=1min&apikey=${TWELVE_DATA_API_KEY}`,
      );
      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      if (payload?.status === "error") {
        return null;
      }

      const quote = normalizeTwelveDataQuote(payload, company, symbol);
      if (!Number.isFinite(quote.price) || quote.price <= 0) {
        return null;
      }

      return quote;
    } catch {
      return null;
    }
  }

  // Local demo quote values are the last resort after both live services fail.
  function fallbackQuote(symbol) {
    const company = findCompanyBySymbol(symbol);
    const baseValues = {
      AAPL: {
        price: 224.13,
        change: 2.16,
        changePercent: 0.97,
        open: 222.5,
        high: 225.7,
        low: 221.4,
        volume: 55234811,
      },
      MSFT: {
        price: 431.82,
        change: -1.39,
        changePercent: -0.32,
        open: 433.7,
        high: 435.1,
        low: 430.8,
        volume: 24120032,
      },
      GOOGL: {
        price: 168.41,
        change: 1.04,
        changePercent: 0.62,
        open: 167.2,
        high: 169.5,
        low: 166.7,
        volume: 18234411,
      },
      AMZN: {
        price: 183.54,
        change: 0.88,
        changePercent: 0.48,
        open: 183.0,
        high: 184.8,
        low: 181.9,
        volume: 35671210,
      },
      TSLA: {
        price: 238.6,
        change: -4.18,
        changePercent: -1.72,
        open: 242.2,
        high: 243.9,
        low: 236.7,
        volume: 94322400,
      },
      NVDA: {
        price: 121.44,
        change: 3.28,
        changePercent: 2.78,
        open: 119.1,
        high: 122.3,
        low: 118.5,
        volume: 41022101,
      },
      META: {
        price: 517.89,
        change: 5.61,
        changePercent: 1.09,
        open: 513.0,
        high: 520.4,
        low: 511.8,
        volume: 14811232,
      },
    };

    const values = baseValues[symbol] || {
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 8,
      changePercent: (Math.random() - 0.5) * 4,
      open: 100 + Math.random() * 200,
      high: 100 + Math.random() * 200,
      low: 100 + Math.random() * 200,
      volume: Math.floor(1000000 + Math.random() * 10000000),
    };

    return {
      symbol,
      name: company?.name || symbol,
      ...values,
    };
  }

  function getQuoteForSymbol(symbol) {
    if (state.currentStock?.symbol === symbol) {
      return state.currentStock;
    }

    return (
      state.quoteMap[symbol] ||
      state.quoteCache[symbol] ||
      fallbackQuote(symbol)
    );
  }

  async function fetchRemoteQuote(symbol) {
    const company = findCompanyBySymbol(symbol);
    if (ALPHA_VANTAGE_API_KEY) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`,
        );

        if (response.ok) {
          const payload = await response.json();
          if (
            !isAlphaVantageDailyLimitExceeded(payload) &&
            !payload?.Note &&
            !payload?.Information &&
            !payload?.ErrorMessage
          ) {
            const normalized = normalizeAlphaVantageQuote(
              payload,
              company,
              symbol,
            );
            if (Number.isFinite(normalized.price) && normalized.price > 0) {
              return {
                ...normalized,
              };
            }
          }
        }
      } catch {
        // If Alpha Vantage fails, try Twelve Data before using local fallback data.
      }
    }

    const twelveDataQuote = await fetchTwelveDataQuote(symbol, company);
    if (twelveDataQuote) {
      return twelveDataQuote;
    }

    return fallbackQuote(symbol);
  }

  // Company-name searches use SYMBOL_SEARCH first so the user can choose the right symbol.
  async function fetchSymbolSearchMatches(keywords) {
    const trimmed = keywords.trim();
    if (!trimmed) {
      return [];
    }

    const fallbackMatches = getCatalogMatches(trimmed).map((entry) => ({
      symbol: entry.symbol,
      name: entry.name,
      region: "Catalog",
      type: "Stock",
      currency: "USD",
      matchScore: 0,
    }));

    if (!ALPHA_VANTAGE_API_KEY) {
      return fallbackMatches;
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(trimmed)}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      );
      if (!response.ok) {
        return fallbackMatches;
      }

      const payload = await response.json();
      if (payload?.Note || payload?.Information || payload?.ErrorMessage) {
        return fallbackMatches;
      }

      const bestMatches = Array.isArray(payload?.bestMatches)
        ? payload.bestMatches
            .map(normalizeAlphaVantageSearchMatch)
            .filter(Boolean)
        : [];

      return bestMatches.length ? bestMatches : fallbackMatches;
    } catch {
      return fallbackMatches;
    }
  }

  // Selected symbol lookup fetches the live quote data used by the details panel and summary.
  async function lookupStock(symbol) {
    const normalizedSymbol = symbol.trim().toUpperCase();
    if (!normalizedSymbol) {
      setStatus("Enter a stock symbol or company name.", "error");
      return;
    }

    setMatches([]);
    setStatus("", "");
    setLoading(true);

    try {
      const quote = await fetchRemoteQuote(normalizedSymbol);
      state.currentStock = quote;
      state.quoteMap[normalizedSymbol] = quote;
      state.quoteCache[normalizedSymbol] = {
        ...quote,
        lastUpdated: Date.now(),
      };
      saveJson(CACHE_KEY, state.quoteCache);
      renderSelectedStock(quote);
      renderWatchlist();
      renderPortfolioSummary();
      setStatus(`Showing results for ${quote.name}.`, "success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load stock data.";
      setStatus(
        message.includes("network")
          ? "Network error. Check your connection."
          : "API error. Try again later.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  // Search input branches between direct symbol lookup and company-name symbol search.
  async function searchStock(query) {
    const trimmed = query.trim();
    if (!trimmed) {
      setStatus("Enter a stock symbol or company name.", "error");
      setMatches([]);
      return;
    }

    const normalizedSymbol = trimmed.toUpperCase();
    const looksLikeSymbol =
      /^[A-Z0-9.\-]{1,7}$/.test(normalizedSymbol) &&
      trimmed === normalizedSymbol;

    if (looksLikeSymbol) {
      await lookupStock(normalizedSymbol);
      return;
    }

    setLoading(true);

    try {
      const matches = await fetchSymbolSearchMatches(trimmed);

      if (!matches.length) {
        setMatches([]);
        setStatus("No matching symbols found.", "error");
        return;
      }

      setStatus(
        `Select the correct symbol for ${trimmed} from the results below.`,
        "success",
      );
      setMatches(matches);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load stock data.";
      setStatus(
        message.includes("network")
          ? "Network error. Check your connection."
          : "API error. Try again later.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }

  // Render the selected quote into the detail panel and keep the watchlist button in sync.
  function renderSelectedStock(stock) {
    const shares = Number(state.portfolio[stock.symbol] || 0);
    const positionValue = shares * stock.price;
    const changeClass =
      stock.change > 0 ? "positive" : stock.change < 0 ? "negative" : "neutral";

    elements.stockDetails.classList.remove("hidden");
    elements.stockSymbol.textContent = stock.symbol;
    elements.stockName.textContent = stock.name;
    elements.stockPrice.textContent = formatCurrency(stock.price);
    elements.stockChange.textContent = `${formatSignedCurrency(stock.change)} (${formatSignedPercent(stock.changePercent)})`;
    elements.stockChange.className = `stock-change ${changeClass}`;
    elements.stockOpen.textContent = formatCurrency(stock.open);
    elements.stockHigh.textContent = formatCurrency(stock.high);
    elements.stockLow.textContent = formatCurrency(stock.low);
    elements.stockVolume.textContent = formatNumber(stock.volume);
    elements.sharesInput.value = shares || "";
    elements.sharesHeld.textContent = formatNumber(shares);
    elements.positionValue.textContent = formatCurrency(positionValue);
    elements.positionValue.className = `position-value ${positionValue > 0 ? "positive" : "neutral"}`;
    elements.watchlistToggle.textContent = state.watchlist.includes(
      stock.symbol,
    )
      ? "Remove from Watchlist"
      : "Add to Watchlist";
    elements.watchlistToggle.dataset.symbol = stock.symbol;

    updateHeaderMetrics();
  }

  // Rebuild the watchlist from the current quote cache and saved watchlist state.
  function renderWatchlist() {
    elements.watchlistList.innerHTML = "";

    if (!state.watchlist.length) {
      elements.watchlistEmpty.classList.remove("hidden");
      return;
    }

    elements.watchlistEmpty.classList.add("hidden");

    const fragment = document.createDocumentFragment();
    state.watchlist.forEach((symbol) => {
      const quote = getQuoteForSymbol(symbol);
      const changeClass =
        quote.change > 0
          ? "positive"
          : quote.change < 0
            ? "negative"
            : "neutral";
      const shares = Number(state.portfolio[symbol] || 0);

      const card = document.createElement("article");
      card.className = "watch-card";
      card.innerHTML = `
        <div>
          <h3>${quote.symbol}</h3>
          <p>${quote.name}</p>
          <div class="watch-meta">
            <span class="watch-price">${formatCurrency(quote.price)}</span>
            <span class="watch-change ${changeClass}">${formatSignedCurrency(quote.change)} (${formatSignedPercent(quote.changePercent)})</span>
            <span>Shares: ${formatNumber(shares)}</span>
          </div>
        </div>
        <div class="watch-actions">
          <button type="button" class="ghost-button" data-symbol="${quote.symbol}">View</button>
          <button type="button" class="remove-button" data-remove="${quote.symbol}">Remove</button>
        </div>
      `;

      fragment.appendChild(card);
    });

    elements.watchlistList.appendChild(fragment);
  }

  // Portfolio totals are derived from the active quote and saved share counts.
  function renderPortfolioSummary() {
    let totalValue = 0;
    let totalDailyChange = 0;
    let positions = 0;
    let topSymbol = "-";
    let topReturn = -Infinity;

    Object.entries(state.portfolio).forEach(([symbol, shares]) => {
      const quote = getQuoteForSymbol(symbol);
      const ownedShares = Number(shares || 0);
      if (ownedShares <= 0) {
        return;
      }

      positions += 1;
      totalValue += quote.price * ownedShares;
      totalDailyChange += quote.change * ownedShares;

      if (quote.changePercent > topReturn) {
        topReturn = quote.changePercent;
        topSymbol = symbol;
      }
    });

    elements.summaryTotal.textContent = formatCurrency(totalValue);
    elements.summaryPositions.textContent = formatNumber(positions);
    elements.summaryTop.textContent = topSymbol;
    elements.summaryChange.textContent = formatSignedCurrency(totalDailyChange);
    elements.summaryChange.className =
      totalDailyChange > 0
        ? "positive"
        : totalDailyChange < 0
          ? "negative"
          : "neutral";
    elements.portfolioValue.textContent = formatCurrency(totalValue);
    elements.stocksOwned.textContent = formatNumber(
      Object.values(state.portfolio).reduce(
        (sum, value) => sum + Number(value || 0),
        0,
      ),
    );
  }

  function updateHeaderMetrics() {
    renderPortfolioSummary();
  }

  // Refresh each watchlist symbol so cached totals stay current.
  async function refreshWatchlistQuotes() {
    if (!state.watchlist.length) {
      renderWatchlist();
      renderPortfolioSummary();
      return;
    }

    setLoading(true);

    try {
      const quotes = await Promise.all(
        state.watchlist.map((symbol) => fetchRemoteQuote(symbol)),
      );
      state.quoteMap = quotes.reduce((accumulator, quote) => {
        accumulator[quote.symbol] = quote;
        state.quoteCache[quote.symbol] = { ...quote, lastUpdated: Date.now() };
        return accumulator;
      }, {});
      saveJson(CACHE_KEY, state.quoteCache);
      renderWatchlist();
      renderPortfolioSummary();
      if (state.currentStock && state.quoteMap[state.currentStock.symbol]) {
        renderSelectedStock(state.quoteMap[state.currentStock.symbol]);
      }
      setStatus("Prices refreshed.", "success");
    } catch {
      setStatus("Network error. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Save the active stock's share count and recalculate totals.
  function syncPortfolio(symbol, shares) {
    if (shares <= 0) {
      delete state.portfolio[symbol];
    } else {
      state.portfolio[symbol] = shares;
    }

    saveJson(PORTFOLIO_KEY, state.portfolio);
    renderPortfolioSummary();
    renderWatchlist();

    if (state.currentStock && state.currentStock.symbol === symbol) {
      state.quoteMap[symbol] = state.currentStock;
      renderSelectedStock(state.currentStock);
    }
  }

  // Add or remove a stock from the watchlist and persist the change.
  function toggleWatchlist(symbol) {
    if (state.watchlist.includes(symbol)) {
      state.watchlist = state.watchlist.filter((entry) => entry !== symbol);
      setStatus(`${symbol} removed from your watchlist.`, "success");
    } else {
      state.watchlist = [...state.watchlist, symbol];
      setStatus(`${symbol} added to your watchlist.`, "success");
    }

    saveJson(WATCHLIST_KEY, state.watchlist);
    renderWatchlist();
    renderPortfolioSummary();

    if (state.currentStock && state.currentStock.symbol === symbol) {
      state.quoteMap[symbol] = state.currentStock;
      renderSelectedStock(state.currentStock);
    }
  }

  function resetPortfolio() {
    localStorage.removeItem(PORTFOLIO_KEY);
    state.portfolio = {};
    window.location.reload();
  }

  // Wire up search, share updates, watchlist actions, and refresh controls.
  function attachListeners() {
    elements.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      searchStock(elements.searchInput.value);
    });

    elements.saveShares.addEventListener("click", () => {
      if (!state.currentStock) {
        setStatus("Search for a stock first.", "error");
        return;
      }

      const shares = Math.max(
        0,
        Number.parseInt(elements.sharesInput.value || "0", 10) || 0,
      );
      syncPortfolio(state.currentStock.symbol, shares);
      renderSelectedStock(state.currentStock);
      setStatus(
        `Saved ${shares} shares for ${state.currentStock.symbol}.`,
        "success",
      );
    });

    elements.watchlistToggle.addEventListener("click", () => {
      const symbol =
        elements.watchlistToggle.dataset.symbol || state.currentStock?.symbol;
      if (!symbol) {
        return;
      }

      toggleWatchlist(symbol);
      if (state.currentStock && state.currentStock.symbol === symbol) {
        renderSelectedStock(state.currentStock);
      }
    });

    elements.refreshWatchlist.addEventListener("click", () => {
      refreshWatchlistQuotes();
    });

    elements.resetPortfolio.addEventListener("click", () => {
      resetPortfolio();
    });

    elements.watchlistList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const viewSymbol = target.dataset.symbol;
      const removeSymbol = target.dataset.remove;

      if (viewSymbol) {
        lookupStock(viewSymbol);
      }

      if (removeSymbol) {
        toggleWatchlist(removeSymbol);
      }
    });
  }

  // Restore cached quotes on load so the app has immediate data before the first refresh.
  function seedViewFromCache() {
    const cachedSymbols = Object.keys(state.quoteCache);
    if (!cachedSymbols.length) {
      renderWatchlist();
      renderPortfolioSummary();
      return;
    }

    state.quoteMap = cachedSymbols.reduce((accumulator, symbol) => {
      accumulator[symbol] = state.quoteCache[symbol];
      return accumulator;
    }, {});

    if (state.watchlist.length) {
      renderWatchlist();
    }

    renderPortfolioSummary();
  }

  // Boot sequence: render controls, restore state, then refresh any existing watchlist.
  async function boot() {
    renderQuickSearches();
    attachListeners();
    seedViewFromCache();

    if (state.watchlist.length) {
      await refreshWatchlistQuotes();
    } else {
      renderWatchlist();
    }

    if (!state.currentStock && QUICK_SEARCHES.length) {
      searchStock(QUICK_SEARCHES[0]);
    }
  }

  boot().catch(() => {
    setStatus("Unable to initialize the dashboard.", "error");
    setLoading(false);
  });
});
