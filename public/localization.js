cloudLocalization({
  defaultLanguage: "en", // optional | The main language used.
  urlLanguageLocation: UrlLanguageLocation.none, // optional | To append language in the url (ex: www.website.com/en/).
  translatorProvider: TranslatorProvider.none, // optional | Translate text using a translator provider.
  translatorProviderKey: "", // optional | The translator provider key.
  logTranslationsFromProvider: false, // optional | Set to true to log the translation output in the console.
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

/*// Load saved language preference or default to English
let selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';

// Initialize localization with the selected language
cloudLocalization({
  defaultLanguage: selectedLanguage,
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

// If we are on the first page (change the URL accordingly), add an event listener to the select element
if (window.location.pathname === "/index.html") {
  const selectElement = document.querySelector('.cloudlocalization-selection');
  
  // Set the selected option in the select element
  selectElement.value = selectedLanguage;
  
  selectElement.addEventListener('change', (event) => {
    selectedLanguage = event.target.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);

    // Re-initialize localization with the new language
    cloudLocalization({
      defaultLanguage: selectedLanguage,
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
  });
}
*/