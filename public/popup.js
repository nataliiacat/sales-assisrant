document.getElementById('scanButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scanSalesItems
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      const resultDiv = document.getElementById('result');
      if (!results || !results[0] || !results[0].result) {
        resultDiv.innerText = `Unable to determine if this is a store.`;
        return;
      }

      const { isStore, discountedItemsCount } = results[0].result;

      if (isStore) {
        resultDiv.innerText = `This is a store. Found ${discountedItemsCount} discounted items.`;
      } else if (discountedItemsCount === 0) {
        resultDiv.innerText = `This is not a store. No discounted items found.`;
      } else {
        resultDiv.innerText = `Unable to determine if this is a store.`;
      }
    });
  }
});

function scanSalesItems() {
  const apiKey = 'AIzaSyCZv5TEocWm3i70GPnPVM_VTEnCcL0ZeM8'; 
  const dom = document.body.innerText.slice(0, 20000); // Збільшено обсяг тексту для аналізу

  console.log('Sending DOM to Gemini API:', dom);

  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `
        Analyze the following DOM content and answer the following questions:
        1. Does this page contain keywords like "sale", "discount", "price", "buy", or "cart"?
        2. Are there elements that look like products (e.g., images with prices)?
        3. If this is a sales page, return a list of CSS selectors for discounted products.
        DOM: \n${dom}
      ` }] }]
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response from Gemini API:', data);

      const selectors = extractSelectors(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
      console.log('Extracted selectors:', selectors);

      let discountedItemsCount = 0;

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        discountedItemsCount += elements.length;

        elements.forEach((el) => {
          const element = /** @type {HTMLElement} */ (el);
          element.style.position = 'relative';
          element.style.border = '4px solid blue';
          element.style.zIndex = '9999';

          const tooltip = document.createElement('div');
          tooltip.innerText = 'Sale item';
          tooltip.style.position = 'absolute';
          tooltip.style.top = '-30px';
          tooltip.style.left = '0';
          tooltip.style.background = '#007BFF';
          tooltip.style.color = '#fff';
          tooltip.style.padding = '4px 8px';
          tooltip.style.borderRadius = '4px';
          tooltip.style.fontSize = '12px';
          tooltip.style.zIndex = '10000';
          tooltip.style.display = 'none';

          element.appendChild(tooltip);

          element.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
          });
          element.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });
        });
      });

      return { isStore: selectors.length > 0, discountedItemsCount };
    })
    .catch(error => {
      console.error('Error fetching data from Gemini API:', error);
      return { isStore: false, discountedItemsCount: 0 };
    });
}

function extractSelectors(text) {
  const regex = /([.#][a-zA-Z0-9_-]+)/g;
  const matches = text.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}