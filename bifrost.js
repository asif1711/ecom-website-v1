try {
    const scriptTag = document.querySelector('script[src*="bifrost.js"]');


    const apiKey = new URL(scriptTag.src).searchParams.get('apiKey');


    var AX = {

        init: function (apiKey, visitId) {
            this.apiKey = apiKey;
            this.visitID = visitId;
        },

        capture: function (eventName, attributes) {
            var eventData = {
                event: eventName,
                attributes: attributes,
                timestamp: new Date().toISOString(),
                vId: this.visitID,
            };

            this.sendDataToAnalyticsService(eventData);
        },

        sendDataToAnalyticsService: async function (data) {
            try {
                const bodyHex = this.convertToHex(JSON.stringify(data));
                const response = await fetch('https://the-js.live/api/capture/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.apiKey,
                    },
                    body: JSON.stringify({'data': bodyHex}),
                    keepalive: true
                });

                if (response.ok) {
                    console.log('captured successfully.');
                } else {
                    console.error('Failed to capture.');
                }
            } catch (error) {
                console.error('Error:', error);
                // Send error to server
                this.sendErrorToServer(error);
            }
        },
        sendErrorToServer: async function (error) {
            try {
                const response = await fetch('https://the-js.live/api/error/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.apiKey,
                    },
                    body: JSON.stringify({
                        error: error.message,
                        stack: error.stack,
                        vId: this.visitID,
                    }),
                    keepalive: true
                });

                if (response.ok) {
                    console.log('Error reported to server.');
                } else {
                    console.error('Failed to report error to server.');
                }
            } catch (err) {
                console.error('Error while reporting error to server:', err);
            }
        },
        // Function to convert string to hex
        convertToHex: function (str) {
            let hex = '';
            for (let i = 0; i < str.length; i++) {
                hex += str.charCodeAt(i).toString(16);
            }
            return hex;
        }
    };

    var detectIncognito = function () {
        return new Promise((function (e, t) {
            var o, n, r = "Unknown";

            function i(t) {
                e({
                    isPrivate: t,
                    browserName: r
                })
            }

            function a(e) {
                return e === eval.toString().length
            }

            function d() {
                void 0 !== navigator.maxTouchPoints ? function () {
                    var e = String(Math.random());
                    try {
                        window.indexedDB.open(e, 1).onupgradeneeded = function (t) {
                            var o, n, r = null === (o = t.target) || void 0 === o ? void 0 : o.result;
                            try {
                                r.createObjectStore("test", {
                                    autoIncrement: !0
                                }).put(new Blob), i(!1)
                            } catch (e) {
                                var a = e;
                                return e instanceof Error && (a = null !== (n = e.message) && void 0 !== n ? n : e), i("string" == typeof a && /BlobURLs are not yet supported/.test(a))
                            } finally {
                                r.close(), window.indexedDB.deleteDatabase(e)
                            }
                        }
                    } catch (e) {
                        return i(!1)
                    }
                }() : function () {
                    var e = window.openDatabase,
                        t = window.localStorage;
                    try {
                        e(null, null, null, null)
                    } catch (e) {
                        return i(!0)
                    }
                    try {
                        t.setItem("test", "1"), t.removeItem("test")
                    } catch (e) {
                        return i(!0)
                    }
                    i(!1)
                }()
            }

            function c() {
                navigator.webkitTemporaryStorage.queryUsageAndQuota((function (e, t) {
                    var o;
                    i(Math.round(t / 1048576) < 2 * Math.round((void 0 !== (o = window).performance && void 0 !== o.performance.memory && void 0 !== o.performance.memory.jsHeapSizeLimit ? performance.memory.jsHeapSizeLimit : 1073741824) / 1048576))
                }), (function (e) {
                    t(new Error("detectIncognito somehow failed to query storage quota: " + e.message))
                }))
            }

            function u() {
                void 0 !== self.Promise && void 0 !== self.Promise.allSettled ? c() : (0, window.webkitRequestFileSystem)(0, 1, (function () {
                    i(!1)
                }), (function () {
                    i(!0)
                }))
            }

            void 0 !== (n = navigator.vendor) && 0 === n.indexOf("Apple") && a(37) ? (r = "Safari", d()) : function () {
                var e = navigator.vendor;
                return void 0 !== e && 0 === e.indexOf("Google") && a(33)
            }() ? (o = navigator.userAgent, r = o.match(/Chrome/) ? void 0 !== navigator.brave ? "Brave" : o.match(/Edg/) ? "Edge" : o.match(/OPR/) ? "Opera" : "Chrome" : "Chromium", u()) : void 0 !== document.documentElement && void 0 !== document.documentElement.style.MozAppearance && a(37) ? (r = "Firefox", i(void 0 === navigator.serviceWorker)) : void 0 !== navigator.msSaveBlob && a(39) ? (r = "Internet Explorer", i(void 0 === window.indexedDB)) : t(new Error("detectIncognito cannot determine the browser"))
        }))
    };


    const fpPromise = import('https://dmoh65e572e6o.cloudfront.net/axfp.js')
        .then(FPJS => FPJS.load())

    fpPromise
        .then(fp => fp.get())
        .then(result => {
            const bId = result.visitorId
            console.log(bId)
            const visitId = bId + '#?/' + Date.now();


// call this event at once in every 3 hours

            const storedValue = localStorage.getItem(apiKey);
            let parts = [];
            let time_difference;
            let pbId;
            if (storedValue !== null) {
                parts = storedValue.split("#?/");
            }

            if (parts.length >= 2) {
                time_difference = (Date.now() - parts[1]) / (1000 * 60 * 60);
                pbId = parts[0];
            } else {
                time_difference = 4;
                pbId = '';
            }


// Check if the value not exists and bId is different and logged in before 3 hours
            if (storedValue === null || pbId !== bId || time_difference >= 3) {
                AX.init(apiKey, visitId);
                const captureData = {
                    referrer: document.referrer,
                    visitId: visitId,
                    path: window.location.href,
                    i: false // Default value assuming not in private mode
                };
                detectIncognito()
                    .then(result => captureData.i = result.isPrivate)
                    .catch(error => console.error(error))
                    .finally(() => AX.capture('deviceRegistration', captureData));
                localStorage.setItem(apiKey, visitId);
            } else {
                AX.init(apiKey, storedValue);
            }


// fetch url param ax_i (it may contain email / mobile / generated hash of email / mobile

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('ax_i')) {
                const axIValue = urlParams.get('ax_i');
                if (isEmail(axIValue)) {
                    AX.capture('autoURLSuppression', {email: axIValue});
                }

            }


// event listener for capturing data to generate buying intent
            const startTime = new Date();

            window.addEventListener('unload', function () {
                const endTime = new Date();
                AX.capture('spentTime', {
                    timeSpent: endTime - startTime, path: window.location.href, referer: document.referrer,
                    startTime: startTime, endTime: endTime
                });

            });

// auto form Suppression

            let forms = document.querySelectorAll('form');
            for (let i = 0; i < forms.length; i++) {

                forms[i].addEventListener('submit', (e) => {
                    var formData = {};
                    var formElements = e.srcElement.elements;

                    for (var i = 0; i < formElements.length; i++) {
                        var element = formElements[i];
                        // Exclude buttons and other non-input elements
                        if (element.tagName.toLowerCase() !== 'button' && (element.type !== 'button' || element.type !== 'submit')) {
                            formData[element.name] = element.value;
                        }
                    }
                    const filteredData = filterSensitiveData(formData);
                    if (Object.keys(filteredData).length > 0) {
                    AX.capture('autoFormSuppression', filteredData);
                    }


                });
            }

            function filterSensitiveData(data) {
                const filteredData = {};

                for (const key in data) {
                    const value = data[key];
                    if (key.toLowerCase().includes('email') && isEmail(value)) {
                        // If the key includes 'email' and the value is a valid email, include it
                        filteredData['email'] = value;
        } else if (key.toLowerCase().includes('mobile') && isMobileNumber(value)) {
                        filteredData['mobile'] = value;
                    }
                }

                return filteredData;
            }


            function isEmail(value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailPattern.test(value);
            }
            function isMobileNumber(value) {
    // Implement your mobile number validation logic here
    // Example: Simple mobile number pattern matching (10 digits)
    const mobilePattern = /^\d{10}$/;
    return mobilePattern.test(value);
}

        })
} catch (error) {
    console.error('Error occurred in the main script:', error);
    // Send error to server
    AX.sendErrorToServer(error);
}