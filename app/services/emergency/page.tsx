
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Language = "bn" | "en";

type EmergencyService = {
  name: Record<Language, string>;
  number: string;
};

const COUNTRY_CODES = [
  "AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT",
  "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BT",
  "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "CV", "KH",
  "CM", "CA", "CF", "TD", "CL", "CN", "CO", "KM", "CG", "CR",
  "CI", "HR", "CU", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO",
  "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FJ", "FI",
  "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN",
  "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ",
  "IE", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KW", "KG",
  "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MG",
  "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX", "FM",
  "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP",
  "NL", "NZ", "NI", "NE", "NG", "KP", "MK", "NO", "OM", "PK",
  "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA",
  "RO", "RU", "RW", "KN", "LC", "VC", "WS", "SM", "ST", "SA",
  "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA",
  "KR", "SS", "ES", "LK", "SD", "SR", "SE", "CH", "SY", "TJ",
  "TZ", "TH", "TL", "TG", "TO", "TT", "TN", "TR", "TM", "TV",
  "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VA", "VE",
  "VN", "YE", "ZM", "ZW",
] as const;

type CountryCode = (typeof COUNTRY_CODES)[number];

const EMERGENCY_DATA: Partial<
  Record<CountryCode, EmergencyService[]>
> = {
  SA: [
    { name: { bn: "একীভূত জরুরি সেবা", en: "Unified Emergency" }, number: "911" },
    { name: { bn: "পুলিশ", en: "Police" }, number: "999" },
    { name: { bn: "অ্যাম্বুলেন্স", en: "Ambulance" }, number: "997" },
    { name: { bn: "সিভিল ডিফেন্স / ফায়ার সার্ভিস", en: "Civil Defense / Fire" }, number: "998" },
    { name: { bn: "সড়ক নিরাপত্তা", en: "Road Security" }, number: "996" },
    { name: { bn: "ট্রাফিক দুর্ঘটনা", en: "Traffic Accidents" }, number: "993" },
    { name: { bn: "কোস্ট গার্ড", en: "Coast Guard" }, number: "994" },
    { name: { bn: "স্বাস্থ্য মন্ত্রণালয়", en: "Ministry of Health" }, number: "937" },
  ],
  BD: [
    { name: { bn: "জাতীয় জরুরি সেবা", en: "National Emergency Service" }, number: "999" },
    { name: { bn: "নারী ও শিশু সহায়তা", en: "Women and Children Helpline" }, number: "109" },
    { name: { bn: "শিশু সহায়তা", en: "Child Helpline" }, number: "1098" },
  ],
  US: [
    { name: { bn: "পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস", en: "Police, Ambulance & Fire" }, number: "911" },
  ],
  CA: [
    { name: { bn: "পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস", en: "Police, Ambulance & Fire" }, number: "911" },
  ],
  GB: [
    { name: { bn: "পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস", en: "Police, Ambulance & Fire" }, number: "999" },
    { name: { bn: "ইউরোপীয় জরুরি নম্বর", en: "Emergency Number" }, number: "112" },
  ],
  IN: [
    { name: { bn: "সর্বভারতীয় জরুরি সেবা", en: "All-in-One Emergency" }, number: "112" },
  ],
  PK: [
    { name: { bn: "পুলিশ", en: "Police" }, number: "15" },
    { name: { bn: "রেসকিউ / অ্যাম্বুলেন্স", en: "Rescue / Ambulance" }, number: "1122" },
  ],
  AE: [
    { name: { bn: "পুলিশ", en: "Police" }, number: "999" },
    { name: { bn: "অ্যাম্বুলেন্স", en: "Ambulance" }, number: "998" },
    { name: { bn: "ফায়ার সার্ভিস", en: "Fire / Civil Defence" }, number: "997" },
  ],
  QA: [
    { name: { bn: "পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিস", en: "Police, Ambulance & Fire" }, number: "999" },
  ],
  JP: [
    { name: { bn: "পুলিশ", en: "Police" }, number: "110" },
    { name: { bn: "অ্যাম্বুলেন্স ও ফায়ার সার্ভিস", en: "Ambulance & Fire" }, number: "119" },
  ],
};

const TEXT = {
  bn: {
    brand: "প্রবাসীদের অভিযোগ",
    back: "সার্ভিস পেজে ফিরে যান",
    title: "জরুরি যোগাযোগ",
    subtitle: "আপনি যে দেশে আছেন, সেই দেশের জরুরি সেবার নম্বর খুঁজুন।",
    country: "দেশ নির্বাচন করুন",
    placeholder: "দেশের নাম লিখুন...",
    change: "দেশ পরিবর্তন",
    selected: "নির্বাচিত দেশ",
    noCountry: "কোনো দেশ পাওয়া যায়নি। অন্য নাম লিখে চেষ্টা করুন।",
    services: "জরুরি সেবার যোগাযোগ নম্বর",
    call: "কল করুন",
    noData: "এই দেশের জরুরি নম্বরগুলো এখনো আমাদের তালিকায় যাচাই করা হয়নি। জরুরি অবস্থায় নিচের সরকারি উৎস থেকে নম্বর যাচাই করুন।",
    noticeTitle: "জরুরি সতর্কবার্তা",
    notice: "জরুরি নম্বর দেশ ও অঞ্চলভেদে আলাদা হতে পারে। কল করার আগে নম্বরটি আপনার বর্তমান অবস্থানের জন্য প্রযোজ্য কি না সরকারি উৎস থেকে নিশ্চিত করুন।",
    source: "আন্তর্জাতিক টেলিযোগাযোগ সংস্থার (ITU) নম্বর তালিকা",
    saudiSource: "সৌদি আরবের সরকারি জরুরি নম্বরের তালিকা",
    sourceLabel: "সরকারি / নির্ভরযোগ্য তথ্য দেখুন",
    choose: "জরুরি নম্বর দেখতে প্রথমে একটি দেশ নির্বাচন করুন।",
    footer: "প্রবাসীদের কথা, এক প্ল্যাটফর্মে",
  },
  en: {
    brand: "Probasider Ovijog",
    back: "Back to Services",
    title: "Emergency Contacts",
    subtitle: "Find emergency service numbers for the country where you are staying.",
    country: "Select a country",
    placeholder: "Type a country name...",
    change: "Change country",
    selected: "Selected country",
    noCountry: "No country found. Try another name.",
    services: "Emergency Service Numbers",
    call: "Call",
    noData: "Emergency numbers for this country have not yet been verified in our directory. Please check the official source below.",
    noticeTitle: "Emergency Warning",
    notice: "Emergency numbers vary by country and region. Confirm that a number applies to your current location using an official source.",
    source: "ITU Important Numbers Directory",
    saudiSource: "Saudi Arabia official emergency numbers",
    sourceLabel: "View official / reliable information",
    choose: "Select a country first to view emergency numbers.",
    footer: "Expatriate voices, one platform",
  },
};

export default function EmergencyPage() {
  const [language, setLanguage] = useState<Language>("bn");
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCode | "">("");

  const t = TEXT[language];

  const englishNames = useMemo(
    () => new Intl.DisplayNames(["en"], { type: "region" }),
    []
  );

  const localNames = useMemo(
    () =>
      new Intl.DisplayNames(
        [language === "bn" ? "bn" : "en"],
        { type: "region" }
      ),
    [language]
  );

  const countries = useMemo(
    () =>
      COUNTRY_CODES.map((code) => ({
        code,
        en: englishNames.of(code) ?? code,
        local: localNames.of(code) ?? englishNames.of(code) ?? code,
      })).sort((a, b) =>
        a.local.localeCompare(
          b.local,
          language === "bn" ? "bn" : "en"
        )
      ),
    [englishNames, localNames, language]
  );

  const selected = countries.find(
    (country) => country.code === selectedCountry
  );

  const suggestions = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();

    if (!search || selectedCountry) return [];

    return countries
      .filter(
        (country) =>
          country.local.toLocaleLowerCase().includes(search) ||
          country.en.toLocaleLowerCase().includes(search)
      )
      .slice(0, 8);
  }, [countries, query, selectedCountry]);

  const services = selectedCountry
    ? EMERGENCY_DATA[selectedCountry] ?? []
    : [];

  function chooseCountry(code: CountryCode) {
    setSelectedCountry(code);
    setQuery("");
  }

  function resetCountry() {
    setSelectedCountry("");
    setQuery("");
  }

  const sourceUrl =
    selectedCountry === "SA"
      ? "https://my.gov.sa/en/emergency-contact"
      : "https://www.itu.int/net/itu-t/inrdb/e129_important_numbers.aspx";

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/services" className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
              🌍
            </span>
            <span className="min-w-0">
              <span className="block font-bold text-emerald-800">
                {t.brand}
              </span>
              <span className="block text-xs text-slate-500">
                {language === "bn" ? "সার্ভিস সেন্টার" : "Service Center"}
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() =>
              setLanguage((current) =>
                current === "bn" ? "en" : "bn"
              )
            }
            className="shrink-0 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            {language === "bn" ? "English" : "বাংলা"}
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
        >
          <span aria-hidden="true">←</span>
          {t.back}
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm">
          <div className="bg-emerald-700 px-5 py-8 text-white sm:px-8 sm:py-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
              🆘
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-50 sm:text-base">
              {t.subtitle}
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <label
              htmlFor="emergency-country"
              className="mb-2 block text-sm font-bold text-slate-800"
            >
              {t.country}
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-100">
              <span className="text-xl" aria-hidden="true">🌐</span>
              <input
                id="emergency-country"
                type="text"
                value={selected ? selected.local : query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedCountry("");
                }}
                placeholder={t.placeholder}
                autoComplete="off"
                aria-autocomplete="list"
                aria-controls="emergency-country-list"
                className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-400 sm:text-base"
              />
              {selectedCountry && (
                <button
                  type="button"
                  onClick={resetCountry}
                  className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  {t.change}
                </button>
              )}
            </div>

            {suggestions.length > 0 && (
              <ul
                id="emergency-country-list"
                className="mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
              >
                {suggestions.map((country) => (
                  <li key={country.code}>
                    <button
                      type="button"
                      onClick={() => chooseCountry(country.code)}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <span className="font-semibold">{country.local}</span>
                      {language === "bn" && (
                        <span className="ml-2 text-xs text-slate-400">
                          {country.en}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {query.trim() !== "" &&
              !selectedCountry &&
              suggestions.length === 0 && (
                <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {t.noCountry}
                </p>
              )}

            {selected && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                <p className="text-xs font-semibold text-emerald-700">
                  {t.selected}
                </p>
                <h2 className="mt-1 text-lg font-bold text-emerald-900">
                  📍 {selected.local}
                  {language === "bn" && ` (${selected.en})`}
                </h2>
              </div>
            )}
          </div>
        </div>

        <section className="mt-8 sm:mt-10">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            {t.services}
          </h2>

          {!selected && (
            <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-white px-5 py-8 text-center">
              <div className="text-3xl" aria-hidden="true">☎️</div>
              <p className="mt-3 text-sm text-slate-600">{t.choose}</p>
            </div>
          )}

          {selected && services.length > 0 && (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={`${service.number}-${service.name.en}`}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                        ☎️
                      </span>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {service.name[language]}
                        </h3>
                        <a
                          href={`tel:${service.number}`}
                          className="mt-1 inline-block text-xl font-bold tracking-wide text-emerald-800 hover:underline"
                        >
                          {service.number}
                        </a>
                      </div>
                    </div>
                    <a
                      href={`tel:${service.number}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      <span aria-hidden="true">📞</span>
                      {t.call}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected && services.length === 0 && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
              <h3 className="font-bold text-amber-900">
                ⚠️ {t.noticeTitle}
              </h3>
              <p className="mt-2 text-sm leading-7 text-amber-900/90">
                {t.noData}
              </p>
            </div>
          )}

          {selected && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">{t.sourceLabel}</h3>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 underline underline-offset-4"
              >
                {selectedCountry === "SA" ? t.saudiSource : t.source}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </section>

        <aside className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="font-bold text-amber-900">
            ⚠️ {t.noticeTitle}
          </h2>
          <p className="mt-2 text-sm leading-7 text-amber-900/90">
            {t.notice}
          </p>
        </aside>

        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            ← {t.back}
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center">
        <p className="text-sm font-semibold text-emerald-800">{t.brand}</p>
        <p className="mt-1 text-xs text-slate-500">{t.footer}</p>
      </footer>
    </main>
  );
}