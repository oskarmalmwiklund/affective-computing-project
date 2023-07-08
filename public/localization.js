// Initialize Cloud Localization
cloudLocalization({
    defaultLanguage: "en",
    urlLanguageLocation: UrlLanguageLocation.none,
    translatorProvider: TranslatorProvider.none,
    translatorProviderKey: "",
    logTranslationsFromProvider: false,
    languages: [
      {
        code: "en",
        displayName: "English"
      },
      {
        code: "es",
        displayName: "Spanish"
      },
      {
        code: "fr",
        displayName: "Français"
      },
      {
        code: "fr-ca",
        displayName: "Français (Canada)"
      },
      {
        code: "ar",
        displayName: "العربية",
        direction: LanguageDirection.rtl
      }
    ]
  });