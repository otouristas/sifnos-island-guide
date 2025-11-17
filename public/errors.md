chunk-W6L2VRDA.js?v=416a9873:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
main.tsx:95 Added cache prevention meta tags with build version: 1763330308922-242
Navigation.tsx:50 Uncaught ReferenceError: mainNavItems is not defined
    at Navigation.tsx:50:6
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at updateFunctionComponent (chunk-W6L2VRDA.js?v=416a9873:14582:28)
    at updateSimpleMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14463:18)
    at updateMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14366:22)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15977:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
HeroSection.tsx:14 Uncaught ReferenceError: useI18n is not defined
    at HeroSection (HeroSection.tsx:14:17)
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at mountIndeterminateComponent (chunk-W6L2VRDA.js?v=416a9873:14926:21)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
    at performUnitOfWork (chunk-W6L2VRDA.js?v=416a9873:19198:20)
    at workLoopSync (chunk-W6L2VRDA.js?v=416a9873:19137:13)
Navigation.tsx:50 Uncaught ReferenceError: mainNavItems is not defined
    at Navigation.tsx:50:6
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at updateFunctionComponent (chunk-W6L2VRDA.js?v=416a9873:14582:28)
    at updateSimpleMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14463:18)
    at updateMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14366:22)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15977:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
HeroSection.tsx:14 Uncaught ReferenceError: useI18n is not defined
    at HeroSection (HeroSection.tsx:14:17)
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at mountIndeterminateComponent (chunk-W6L2VRDA.js?v=416a9873:14926:21)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
    at performUnitOfWork (chunk-W6L2VRDA.js?v=416a9873:19198:20)
    at workLoopSync (chunk-W6L2VRDA.js?v=416a9873:19137:13)
chunk-W6L2VRDA.js?v=416a9873:521 Warning: Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: SideEffect(NullComponent2)
printWarning @ chunk-W6L2VRDA.js?v=416a9873:521
chunk-W6L2VRDA.js?v=416a9873:14032 The above error occurred in the <DesktopNavItems> component:

    at http://localhost:8080/src/components/Navigation.tsx?t=1763330190760:95:47
    at div
    at div
    at div
    at div
    at header
    at Navigation (http://localhost:8080/src/components/Navigation.tsx?t=1763330190760:494:33)
    at Router (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4451:15)
    at BrowserRouter (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:5196:5)
    at TouristasProvider (http://localhost:8080/src/contexts/TouristasContext.tsx:13:37)
    at I18nProvider (http://localhost:8080/src/contexts/I18nContext.tsx:22:32)
    at AuthProvider (http://localhost:8080/src/lib/auth.tsx:17:32)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-QUKTJ62H.js?v=416a9873:38:15)
    at TooltipProvider (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=416a9873:65:5)
    at QueryClientProvider (http://localhost:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=416a9873:2794:3)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
logCapturedError @ chunk-W6L2VRDA.js?v=416a9873:14032
chunk-W6L2VRDA.js?v=416a9873:14032 The above error occurred in the <HeroSection> component:

    at HeroSection (http://localhost:8080/src/components/home/HeroSection.tsx?t=1763330297681:31:22)
    at HomePage
    at RenderedRoute (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4069:5)
    at Routes (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4508:5)
    at main
    at Router (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4451:15)
    at BrowserRouter (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:5196:5)
    at TouristasProvider (http://localhost:8080/src/contexts/TouristasContext.tsx:13:37)
    at I18nProvider (http://localhost:8080/src/contexts/I18nContext.tsx:22:32)
    at AuthProvider (http://localhost:8080/src/lib/auth.tsx:17:32)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-QUKTJ62H.js?v=416a9873:38:15)
    at TooltipProvider (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=416a9873:65:5)
    at QueryClientProvider (http://localhost:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=416a9873:2794:3)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
logCapturedError @ chunk-W6L2VRDA.js?v=416a9873:14032
chunk-W6L2VRDA.js?v=416a9873:19413 Uncaught ReferenceError: mainNavItems is not defined
    at Navigation.tsx:50:6
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at updateFunctionComponent (chunk-W6L2VRDA.js?v=416a9873:14582:28)
    at updateSimpleMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14463:18)
    at updateMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14366:22)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15977:22)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19753:22)
    at performUnitOfWork (chunk-W6L2VRDA.js?v=416a9873:19198:20)
    at workLoopSync (chunk-W6L2VRDA.js?v=416a9873:19137:13)
    at renderRootSync (chunk-W6L2VRDA.js?v=416a9873:19116:15)
(index):90 🚀 Touristas AI Service Worker registered successfully: http://localhost:8080/
(index):97 📱 Touristas AI can be installed as an app!
(index):1 Banner not shown: beforeinstallpromptevent.preventDefault() called. The page must call beforeinstallpromptevent.prompt() to show the banner.
(index):1 The resource http://localhost:8080/fonts/inter.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
(index):1 The resource http://localhost:8080/fonts/inter.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
Navigation.tsx:50 Uncaught ReferenceError: mainNavItems is not defined
    at Navigation.tsx:50:6
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at updateFunctionComponent (chunk-W6L2VRDA.js?v=416a9873:14582:28)
    at updateSimpleMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14463:18)
    at updateMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14366:22)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15977:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
HeroSection.tsx:14 Uncaught ReferenceError: useI18n is not defined
    at HeroSection (HeroSection.tsx:14:17)
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at mountIndeterminateComponent (chunk-W6L2VRDA.js?v=416a9873:14926:21)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
    at performUnitOfWork (chunk-W6L2VRDA.js?v=416a9873:19198:20)
    at workLoopSync (chunk-W6L2VRDA.js?v=416a9873:19137:13)
Navigation.tsx:50 Uncaught ReferenceError: mainNavItems is not defined
    at Navigation.tsx:50:6
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at updateFunctionComponent (chunk-W6L2VRDA.js?v=416a9873:14582:28)
    at updateSimpleMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14463:18)
    at updateMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14366:22)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15977:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
HeroSection.tsx:14 Uncaught ReferenceError: useI18n is not defined
    at HeroSection (HeroSection.tsx:14:17)
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at mountIndeterminateComponent (chunk-W6L2VRDA.js?v=416a9873:14926:21)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15914:22)
    at HTMLUnknownElement.callCallback2 (chunk-W6L2VRDA.js?v=416a9873:3674:22)
    at Object.invokeGuardedCallbackDev (chunk-W6L2VRDA.js?v=416a9873:3699:24)
    at invokeGuardedCallback (chunk-W6L2VRDA.js?v=416a9873:3733:39)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19765:15)
    at performUnitOfWork (chunk-W6L2VRDA.js?v=416a9873:19198:20)
    at workLoopSync (chunk-W6L2VRDA.js?v=416a9873:19137:13)
chunk-W6L2VRDA.js?v=416a9873:14032 The above error occurred in the <DesktopNavItems> component:

    at http://localhost:8080/src/components/Navigation.tsx?t=1763330190760:95:47
    at div
    at div
    at div
    at div
    at header
    at Navigation (http://localhost:8080/src/components/Navigation.tsx?t=1763330190760:494:33)
    at Router (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4451:15)
    at BrowserRouter (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:5196:5)
    at TouristasProvider (http://localhost:8080/src/contexts/TouristasContext.tsx:13:37)
    at I18nProvider (http://localhost:8080/src/contexts/I18nContext.tsx:22:32)
    at AuthProvider (http://localhost:8080/src/lib/auth.tsx:17:32)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-QUKTJ62H.js?v=416a9873:38:15)
    at TooltipProvider (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=416a9873:65:5)
    at QueryClientProvider (http://localhost:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=416a9873:2794:3)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
logCapturedError @ chunk-W6L2VRDA.js?v=416a9873:14032
chunk-W6L2VRDA.js?v=416a9873:14032 The above error occurred in the <HeroSection> component:

    at HeroSection (http://localhost:8080/src/components/home/HeroSection.tsx?t=1763330297681:31:22)
    at HomePage
    at RenderedRoute (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4069:5)
    at Routes (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4508:5)
    at main
    at Router (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:4451:15)
    at BrowserRouter (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=416a9873:5196:5)
    at TouristasProvider (http://localhost:8080/src/contexts/TouristasContext.tsx:13:37)
    at I18nProvider (http://localhost:8080/src/contexts/I18nContext.tsx:22:32)
    at AuthProvider (http://localhost:8080/src/lib/auth.tsx:17:32)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-QUKTJ62H.js?v=416a9873:38:15)
    at TooltipProvider (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=416a9873:65:5)
    at QueryClientProvider (http://localhost:8080/node_modules/.vite/deps/@tanstack_react-query.js?v=416a9873:2794:3)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
logCapturedError @ chunk-W6L2VRDA.js?v=416a9873:14032
Navigation.tsx:50 Uncaught (in promise) ReferenceError: mainNavItems is not defined
    at Navigation.tsx:50:6
    at renderWithHooks (chunk-W6L2VRDA.js?v=416a9873:11548:26)
    at updateFunctionComponent (chunk-W6L2VRDA.js?v=416a9873:14582:28)
    at updateSimpleMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14463:18)
    at updateMemoComponent (chunk-W6L2VRDA.js?v=416a9873:14366:22)
    at beginWork (chunk-W6L2VRDA.js?v=416a9873:15977:22)
    at beginWork$1 (chunk-W6L2VRDA.js?v=416a9873:19753:22)
    at performUnitOfWork (chunk-W6L2VRDA.js?v=416a9873:19198:20)
    at workLoopSync (chunk-W6L2VRDA.js?v=416a9873:19137:13)
    at renderRootSync (chunk-W6L2VRDA.js?v=416a9873:19116:15)
(index):1 The resource http://localhost:8080/fonts/inter.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
(index):105 💡 Tip: Install Touristas AI for the best experience!
(index):1 The resource http://localhost:8080/fonts/inter.woff2 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally.
