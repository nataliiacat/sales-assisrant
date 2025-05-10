import React from 'react';

const App = () => {
  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: scanSalesItems
      });
    }
  };

  const scanSalesItems = async () => {
    const apiKey = 'AIzaSyCZv5TEocWm3i70GPnPVM_VTEnCcL0ZeM8';
    const dom = document.body.innerText.slice(0, 10000);

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `DOM: \n${dom}\n\nIs this a sales page? What items are on sale? Return a list of CSS selectors for discounted products.` }] }]
      })
    })
      .then(response => response.json())
      .then(data => {
        const selectors = extractSelectors(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            const element = el as HTMLElement;
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
      });
  };

  const extractSelectors = (text: string): string[] => {
    const regex = /([.#][a-zA-Z0-9_-]+)/g;
    const matches = text.match(regex);
    return matches ? Array.from(new Set(matches)) : [];
  };

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={handleClick}>Scan Page</button>
    </div>
  );
};

export default App;