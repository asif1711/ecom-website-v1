
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.baseline.en.531487ab5badcfbf1593.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/922.baseline.en.f7cf671d5695adc84050.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/398.baseline.en.6cb17909eaba9ddb9e79.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/681.baseline.en.ff7efde01de8f69bae07.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.5b55e0a81be32c210242.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/751.baseline.en.b034168d5d5932189976.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/21.baseline.en.04149fd5b11fbbdef71a.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/214.baseline.en.953f18ae0bb61247681f.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/100.baseline.en.a4f86ac8f0bbf8d9ab36.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/OnePage.baseline.en.f15ccf0e3172af73ee71.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/922.baseline.en.0889aa98e72febe5bf4e.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.baseline.en.2d377df065f6452dd591.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/21.baseline.en.9549af9221f295bc1d31.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/268.baseline.en.276e5cc2e7481c3ffaf1.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0843/7114/5023/files/logo_f_x320.png?v=1701695579","https://cdn.shopify.com/s/files/1/0843/7114/5023/files/gradient_2_2000x.png?v=1701774941"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  